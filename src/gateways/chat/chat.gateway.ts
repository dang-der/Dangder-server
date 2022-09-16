import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'dangderchats',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService, //
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('join')
  createChatRoom(client: Socket, payload: any) {
    const { roomId, dog } = payload;
    console.log(`${JSON.stringify(dog)} connected! : ${roomId}`);

    client.leave(client.id);
    client.join(roomId);
    const message = `${dog.name}님이 입장하셨습니다.`;
    this.server
      .to(roomId)
      .emit('message', { dog, type: 'enter', data: { message } });
  }

  @SubscribeMessage('send')
  async sendMessage(client: Socket, payload: any) {
    const { roomId, dog, type, data } = payload;
    console.log(
      `send! : [${roomId}] ${JSON.stringify(dog)} : ${JSON.stringify(data)}`,
    );
    // 채팅 메시지 DB에 저장
    await this.chatService.create({ roomId, senderId: dog.id, data });

    client.leave(client.id);
    client.join(roomId);
    this.server.to(roomId).emit('message', { dog, type, data });
    // client.to(roomId).emit('message', { type: 'text', data: { message: data.message } });
  }

  // afterInit(server: Server) {
  afterInit() {
    this.logger.log(
      `================== Socket Server initialized ==================`,
    );
  }

  handleDisconnect(client: Socket) {
    client.leave(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
