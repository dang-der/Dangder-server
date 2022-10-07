import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChatMessage } from '../chatMessages/entities/chatMessage.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { ChatRoomsOutput } from './dto/chatRoomsOutput.output';
import { ChatRoom } from './entities/chatRoom.entity';

/**
 * ChatRoom Service
 */
@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,

    // QueryBuilder 사용을 위한 dataSource 선언
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create ChatRoom by User & Pair dogId
   * 채팅방 생성과 동시에 내부에 init 메시지 생성
   * @param dogId 내 강아지 아이디
   * @param chatPairId 채팅 상대방 강아지 아이디
   * @returns 생성된 채팅방 정보
   */
  async create({ dogId, chatPairId }) {
    const result = await this.chatRoomsRepository.save({
      dog: { id: dogId },
      chatPairId,
    });

    // 만드는 순간 첫 메시지 빈 값으로 생성 (init. 추후 findChatRooms의 정렬 기준이 된다.)
    await this.chatMessagesRepository.save({
      chatRoom: { id: result.id },
      senderId: dogId,
      type: 'init',
      message: 'CREATED BY senderId',
    });

    return result;
  }

  /**
   * Find ChatRoom by ChatRoom Id
   * @param roomId 찾고자하는 채팅방 id
   * @returns 찾은 채팅방 정보
   */
  async findOne({ roomId }) {
    const result = await this.chatRoomsRepository.findOne({
      where: { id: roomId },
      relations: { dog: true },
    });
    return result;
  }

  /**
   * Find ChatRoom by dogId & chatPairId
   * @param dogId 내 강아지 아이디
   * @param chatPairId 채팅 상대방 강아지 아이디
   * @returns 찾은 채팅방 정보
   */
  async findChatRoom({ dogId, chatPairId }) {
    const result = await this.chatRoomsRepository.findOne({
      where: { dog: { id: dogId }, chatPairId },
      relations: { dog: true },
    });
    return result;
  }

  /**
   * Find ChatRooms (Joined)
   * 내가(dogId) 참가한 모든 채팅방들 찾아오기.
   * Host, Guest 인 모든 채팅방을 찾아서
   * 채팅방 id, 대화상대 정보, 마지막 채팅메시지를 찾아
   * 가장 최신 대화 순으로 정렬해 반환한다.
   * @param dogId 내 강아지 id
   * @returns 찾은 채팅방들의 정보들.
   */
  async findChatRooms({ dogId }) {
    // 내가 host인 채팅방들
    const hostRoomsInfo = await this.chatRoomsRepository.find({
      where: { dog: { id: dogId } },
      relations: { dog: true },
    });
    // 내가 guest인 채팅방들
    const guestRoomsInfo = await this.chatRoomsRepository.find({
      where: { chatPairId: dogId },
      relations: { dog: true },
    });
    // 방 정보들 합치기
    const myRoomsInfo = [...hostRoomsInfo, ...guestRoomsInfo];

    // 채팅 상대방 강아지 정보 가져오기
    // 1. 내가 host일 때 - 상대방이 guest
    const chatGuestDogs = [];
    for (const chatRoom of hostRoomsInfo) {
      const chatGuestDog = await this.dogsRepository.findOne({
        where: { id: chatRoom.chatPairId },
        relations: { img: true },
      });
      chatGuestDogs.push(chatGuestDog);
    }
    // 2. 내가 guest일 때 - 상대방이 host
    const chatHostDogs = [];
    for (const chatRoom of guestRoomsInfo) {
      const chatHostDog = await this.dogsRepository.findOne({
        where: { id: chatRoom.dog.id },
        relations: { img: true },
      });
      chatHostDogs.push(chatHostDog);
    }
    // 상대방 강아지 정보들 합치기
    const chatPairDogs = [...chatGuestDogs, ...chatHostDogs];

    // 채팅방의 마지막 메시지 가져오기
    const lastMessages = [];
    for (const chatRoom of myRoomsInfo) {
      const findLastMessageByChatRoomId = await this.dataSource
        .getRepository(ChatMessage)
        .createQueryBuilder('chatMessage')
        .where('chatMessage.chatRoomId = :id', {
          id: chatRoom.id,
        })
        .orderBy('chatMessage.chatCreatedAt', 'DESC')
        .getOne();
      lastMessages.push(findLastMessageByChatRoomId);
    }

    let result = [];
    myRoomsInfo.map((chatRoom, idx) => {
      const output = new ChatRoomsOutput();
      output.id = chatRoom.id;
      output.chatPairDog = chatPairDogs[idx];
      output.lastMessage = lastMessages[idx];
      result.push(output);
    });

    // 최신 메시지 순으로 결과값 정렬
    result = result.sort(
      (a, b) => b.lastMessage.chatCreatedAt - a.lastMessage.chatCreatedAt,
    );

    return result;
  }

  /**
   * Delete ChatRoom (softDelete)
   * @param id 채팅방 id
   * @returns 채팅방 삭제 여부
   */
  async delete({ id }) {
    // 채팅방에 속한 메시지들도 모두 삭제.
    await this.chatMessagesRepository.softDelete({
      chatRoom: { id },
    });
    const result = await this.chatRoomsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
