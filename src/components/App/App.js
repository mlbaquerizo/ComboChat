import React from 'react';
import Authentication from '../../util/Authentication/Authentication';
import ChatBot from '../../util/ChatBot/ChatBot';

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.Authentication = new Authentication()
    this.ChatBot = new ChatBot({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      channels: [process.env.CHANNEL],
    });

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      msgCount: {},
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return { theme: context.theme }
      })
    }
  }

  visibilityChanged(isVisible) {
    this.setState(() => {
      return {
        isVisible
      }
    })
  }

  // Called every time a message comes in
  onMessageHandler(target, context, msg, self) {
    // ignore messages from the bot
    if (self) {
      return;
    }

    const messageUserId = context["user-id"];
    const userId = this.Authentication.getUserId();
    const isChatMessage = context["message-type"] === 'chat';
    const isCurrentUser = messageUserId === userId;
    if(isChatMessage && isCurrentUser){
      const { msgCount } = this.state;

      if (msgCount[userId]) {
        msgCount[userId] += 1;
      } else {
        msgCount[userId] = 1;
      }
  
      this.setState({msgCount});
    }
    return;
  }

  // Called every time the bot connects to Twitch chat
  onConnectedHandler (addr, port) {
    window.Twitch.ext.rig.log(`* Connected to ${addr}:${port}`);
  }

  componentDidMount() {
    if (this.twitch) {
      this.ChatBot.setHandler('message', this.onMessageHandler.bind(this));
      this.ChatBot.setHandler('connected', this.onConnectedHandler.bind(this));
      this.ChatBot.connect();
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId)
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => {
            return { finishedLoading: true }
          })
        }
      })

      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        // now that you've got a listener, do something with the result... 

        // do something...

      })

      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible)
      })

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta)
      })
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
    }
  }

  render() {
    this.twitch.rig.log(`STATE: ${JSON.stringify(this.state.msgCount)}`);
    const comboCount = this.state.msgCount[this.Authentication.getUserId()] || 0;
    if (this.state.finishedLoading && this.state.isVisible) {
      return (
        <h1 style={{ fontSize: '100px', color: "white" }}>{`COMBO: ${comboCount}`}</h1>
      )
    } else {
      return (
        <div className="App">
        </div>
      )
    }

  }
}