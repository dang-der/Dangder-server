const app = new Vue({
  el: '#app',
  data: {
    title: 'Nestjs Websockets 채팅 무한삽질',
    roomId: '',
    name: '',
    text: '',
    welcomes: [],
    messages: [],
    socket: null,
  },
  methods: {
    enterChatRoom() {
      const roomId = prompt('입장할 채팅방의 코드를 입력하세요');
      this.roomId = roomId;
      this.welcomes = [];
      this.messages = [];
      this.text = '';
      const message = {
        roomId: this.roomId,
        name: this.name,
      };
      this.initChatRoom(message);
    },
    initChatRoom(message) {
      const { roomId, name } = message;
      this.socket.emit('createRoom', { roomId, user: { name } });
    },
    sendMessage() {
      if (this.validateInput()) {
        const message = {
          roomId: this.roomId,
          name: this.name,
          text: this.text,
        };
        this.socket.emit('send', message);
        this.text = '';
      }
    },
    receivedJoin(welcome) {
      if (!this.welcomes.includes(welcome)) this.welcomes.push(welcome);
    },
    receivedMessage(message) {
      this.messages.push(message);
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    },
  },
  created() {
    this.socket = io('https://recipemaker.shop/chats');
    this.socket.on('join', (message) => {
      const { data } = message;
      const welcome = `${data.roomId}방에 ${data.name}님이 입장하셨습니다.`;
      this.receivedJoin(welcome);
    });
    this.socket.on('message', (message) => {
      const { type, data } = message;
      const msg = {
        name: data.user,
        text: data.msg,
      };
      this.receivedMessage(msg);
    });
  },
});
