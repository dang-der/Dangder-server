import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChatMessage } from '../chatMessages/entities/chatMessage.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { ChatRoomsOutput } from './dto/chatRoomsOutput.output';
import { ChatRoom } from './entities/chatRoom.entity';

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

  // 채팅방 id, 본인 id, 상대방 id로 저장
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

  // 채팅방을 찾는 로직. roomId로 찾는다.
  async findOne({ roomId }) {
    const result = await this.chatRoomsRepository.findOne({
      where: { id: roomId },
      relations: { dog: true },
    });
    return result;
  }

  // 채팅방을 찾는 로직. dogId와 chatPairId로 찾는다.
  async findChatRoom({ dogId, chatPairId }) {
    const result = await this.chatRoomsRepository.findOne({
      where: { dog: { id: dogId }, chatPairId },
      relations: { dog: true },
    });
    return result;
  }

  // 채팅방들을 찾는 로직. dogId로 참가한 채팅방들을 찾는다.
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

  // chatRoomId 로 채팅방, 연결된 채팅메시지들 삭제
  async delete({ id }) {
    await this.chatMessagesRepository.softDelete({
      chatRoom: { id },
    });
    const result = await this.chatRoomsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
