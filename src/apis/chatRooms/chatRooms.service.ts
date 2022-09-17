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
  create({ dogId, chatPairId }) {
    return this.chatRoomsRepository.save({ dog: { id: dogId }, chatPairId });
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
    const myRoomsInfo = await this.chatRoomsRepository.find({
      where: { dog: { id: dogId } },
      relations: { dog: true },
    });

    // 채팅 상대방 강아지 정보 가져오기
    const chatPairDogs = [];
    for (const chatRoom of myRoomsInfo) {
      const chatPairDog = await this.dogsRepository.findOne({
        where: { id: chatRoom.chatPairId },
      });
      chatPairDogs.push(chatPairDog);
    }

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

    const result = [];
    myRoomsInfo.map((chatRoom, idx) => {
      const output = new ChatRoomsOutput();
      output.id = chatRoom.id;
      output.chatPairDog = chatPairDogs[idx];
      output.dog = chatRoom.dog;
      output.lastMessage = lastMessages[idx];
      result.push(output);
    });

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
