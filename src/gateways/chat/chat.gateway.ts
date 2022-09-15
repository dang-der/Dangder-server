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

  @SubscribeMessage('createRoom')
  createChatRoom(client: Socket, payload: any) {
    const { roomId, user } = payload;
    console.log('createRoom', roomId, user);

    client.join(roomId);
    client.emit('join', { type: 'enter', data: { roomId, name: user.name } });
    this.server.to(roomId).emit('message', {
      type: 'enter',
      data: {
        roomId: roomId,
        msg: `${user.name}님이 입장하셨습니다.`,
      },
      msg: '',
    });
  }

  @SubscribeMessage('enterRoom')
  enterChatRoom(client: Socket, payload: any) {
    const { roomId, user } = payload;
    console.log('enterRoom', payload);

    client.join(roomId);
    client.emit('enter', { type: 'enter', data: { roomId } });
    this.server.to(roomId).emit('message', {
      type: 'enter',
      data: {
        roomId: roomId,
        msg: `${user.name}님이 입장하셨습니다.`,
      },
      msg: '',
    });
  }

  @SubscribeMessage('send')
  sendMessage(client: Socket, payload: any): void {
    const { roomId, name, text } = payload;
    console.log('sendMessage : ', payload);
    this.server.to(roomId).emit('message', {
      type: 'message',
      data: { msg: text, user: name },
      roomId,
    });
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
