const tmi = require('tmi.js');

export default class ChatBot {
  constructor({ username, password, channels }) {
    const opts = {
      identity: {
        username,
        password,
      },
      channels,
    };

    // Create a client with our options
    const client = new tmi.client(opts); // eslint-disable-line new-cap
    this.client = client;
  }

  setHandler(topic, handler) {
    this.client.on(topic, handler);
  }

  removeHandler(topic, handler) {
    this.client.removeListener(topic, handler);
  }

  connect() {
    // Connect to Twitch
    this.client.connect();
  }

  disconnect() {
    this.client.disconnect();
  }
}
