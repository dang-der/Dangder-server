const app = new Vue({
  el: '#app',
  data: {
    title: 'Nestjs Websockets 채팅 무한삽질',
    room: '',
    name: '',
    text: '',
    welcomes: [],
    messages: [],
    socket: null,
  },
  methods: {
    changeChatRoom() {
      const room = prompt('입장할 채팅방의 코드를 입력하세요');
      this.room = room;
      this.welcomes = [];
      this.messages = [];
      this.text = '';
      const message = {
        room: this.room,
        name: this.name,
      };
      this.initChatRoom(message);
    },
    initChatRoom(message) {
      this.socket.emit('init', message);
    },
    sendMessage() {
      if (this.validateInput()) {
        const message = {
          room: this.room,
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
    this.socket = io('http://localhost:3000/chats');
    this.socket.on('init', (welcome) => {
      this.initChatRoom(welcome);
    });
    this.socket.on('join', (welcome) => {
      this.receivedJoin(welcome);
    });
    this.socket.on('sendToWindow', (message) => {
      this.receivedMessage(message);
    });
  },
});
