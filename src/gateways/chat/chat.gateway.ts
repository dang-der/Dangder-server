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

/**
 * WebSocket Gateway to Chatting
 * @Events [`ON`] `join`, `send`, [`EMIT`] `message`
 * @APIs `createChatRoom`, `sendMessage`, `afterInit`, `handleDisconnect`, `handleConnection`
 */
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
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  /**
   * Create Chat Server API
   * 유저가 채팅 서버 접속 시, 채팅방에 join 후 환영메시지 전달
   * @param client 이벤트를 호출한 서버(Client - Socket)
   * @param payload 이벤트와 함께 전달된 데이터
   */
  @SubscribeMessage('join')
  createChatRoom(client: Socket, payload: any) {
    const { roomId, dog } = payload;

    client.leave(client.id);
    client.join(roomId);
    const message = `${dog.name}님이 입장하셨습니다.`;
    this.server
      .to(roomId)
      .emit('message', { dog, type: 'enter', data: { message } });
  }

  /**
   * Send Chat Message API
   * send 이벤트에 맞추어 websocket에 데이터 전달 및 DB 저장
   * @param client 이벤트를 호출한 서버(Client - Socket)
   * @param payload 이벤트와 함께 전달된 데이터
   */
  @SubscribeMessage('send')
  async sendMessage(client: Socket, payload: any) {
    const { roomId, dog, type, data } = payload;

    // 채팅 메시지 DB에 저장
    await this.chatService.create({ roomId, senderId: dog.id, type, data });

    client.leave(client.id);
    client.join(roomId);
    this.server.to(roomId).emit('message', { dog, type, data });
  }

  @SubscribeMessage('sendInterest')
  async sendInterestMessage(client: Socket, payload: any) {
    const { iRoomId, dog, type, data } = payload;

    // 채팅 메시지 DB에 저장
    await this.chatService.createInterest({ iRoomId, senderId: dog.id, type, data });

    client.leave(client.id);
    client.join(iRoomId);
    this.server.to(iRoomId).emit('message', { dog, type, data });
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
