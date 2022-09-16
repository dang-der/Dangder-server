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

@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  // @SubscribeMessage('connection')
  // connectChatRoom(client: Socket, payload: any): void {}

  @SubscribeMessage('join')
  createChatRoom(client: Socket, payload: any) {
    const { roomId, dog } = payload;
    console.log(`${JSON.stringify(dog)} connected! : ${roomId}`);

    client.join(roomId);
    const message = `${dog.name}님이 입장하셨습니다.`;
    client.emit('message', { type: 'enter', data: { message } });
  }

  @SubscribeMessage('send')
  sendMessage(client: Socket, payload: any): void {
    const { roomId, dog, type, data } = payload;
    console.log(
      `send! : [${roomId}] ${JSON.stringify(dog)} : ${JSON.stringify(data)}`,
    );

    this.server
      .to(roomId)
      .emit('message', { dog, type: 'text', data: { message: data.message } });
    // client.to(roomId).emit('message', { type: 'text', data: { message: data.message } });
  }

  afterInit(server: Server) {
    this.logger.log(
      `================== Socket Server initialized ==================`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
