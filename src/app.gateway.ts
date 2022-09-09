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
  cors: {
    origin: '*',
  },
  namespace: 'chats',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('init')
  initChatRoom(client: Socket, payload: any): void {
    const { room, name } = payload;
    const welcome = `[${room}] 방에 ${name}님이 입장하셨습니다.`;
    this.server.emit('join', welcome);
    console.log(`[${room}] 입장 : ${name}`);
  }
  @SubscribeMessage('send')
  sendMessage(client: Socket, payload: any): void {
    const { room } = payload;
    this.server.emit('sendToWindow', payload);
    console.log(payload, room);
    // console.log(client.id);
    // console.log(client.handshake.headers);
    // console.log(client.handshake.time);
    // console.log('---------------------------------');
    // console.log(client.broadcast['adapter']);
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
