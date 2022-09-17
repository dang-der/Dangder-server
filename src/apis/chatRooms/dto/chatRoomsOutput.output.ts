import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMessage } from 'src/apis/chatMessages/entities/chatMessage.entity';
import { Dog } from 'src/apis/dogs/entities/dog.entity';

@ObjectType({ description: 'findChatRooms 출력 형식' })
export class ChatRoomsOutput {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => Dog, { nullable: true })
  chatPairDog: Dog;

  @Field(() => Dog, { nullable: true })
  dog: Dog;

  @Field(() => ChatMessage, { nullable: true })
  lastMessage: ChatMessage;
}
