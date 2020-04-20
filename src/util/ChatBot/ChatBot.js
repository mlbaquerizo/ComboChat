const tmi = require('tmi.js');

export default class ChatBot {
  constructor({username, password, channels}) {
    const opts = {
      identity: {
        username,
        password,
      },
      channels,
    };

    // Create a client with our options
    const client = new tmi.client(opts); 
    this.client = client;
  }

  setHandler(topic, handler) {
    this.client.on(topic, handler);
  }

  connect() {
    // Connect to Twitch
    this.client.connect();
  }

}