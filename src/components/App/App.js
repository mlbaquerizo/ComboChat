import React, { useState, useEffect } from 'react';
import ComboCount from '../ComboCount';
import Authentication from '../../util/Authentication/Authentication';
import ChatBot from '../../util/ChatBot/ChatBot';
import './App.css';

const authentication = new Authentication();
const chatBot = new ChatBot({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  channels: [process.env.CHANNEL],
});

export default () => {
  const twitch = window.Twitch ? window.Twitch.ext : null;

  const [finishedLoading, setFinishedLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isVisible, setIsVisble] = useState(true);
  const [msgCount, setMsgCount] = useState({});
  const [comboCountClass, setComboCountClass] = useState('')

  const contextUpdate = (context, delta) => {
    if(delta.includes('theme')) {
      setTheme(context.theme);
    }
  };

  const visibilityChanged = (isVisible) => {
    setIsVisble(isVisible);
  };

  useEffect(() => {
    setComboCountClass('');
    if (twitch) {
      // Called every time the bot connects to Twitch chat
      const onConnectedHandler = (addr, port) => {
        twitch.rig.log(`* Connected to ${addr}:${port}`);
      };

      // Called every time a message comes in
      const onMessageHandler = (channel, userstate, msg, self) => {
        // ignore messages from the bot
        if (self) {
          return;
        }

        const messageUserId = userstate["user-id"];
        const userId = authentication.getUserId();
        const isCurrentUser = messageUserId === userId;

        console.log("CLASS IN MESSAGE HANDLER: ", comboCountClass);
        if (isCurrentUser) {
          setComboCountClass('comboShake')
          setMsgCount(count => {
            return { ...count, [userId]: count[userId] ? count[userId] + 1 : 1 };
          }); 
          setComboCountClass('comboShakeEnd')
        } 
      };

      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId)
        if (!finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          setFinishedLoading(true);
        }
      });

      twitch.listen('broadcast', (target, contentType, body) => {
        twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        // now that you've got a listener, do something with the result... 

        // do something...

      });

      twitch.onVisibilityChanged((isVisible, _c) => {
        visibilityChanged(isVisible)
      });

      twitch.onContext((context, delta) => {
        contextUpdate(context, delta)
      });

      chatBot.setHandler('chat', onMessageHandler);
      chatBot.setHandler('connected', onConnectedHandler);
      chatBot.connect();

      return function cleanup() {
        twitch.unlisten('broadcast', () => console.log('successfully unlistened'));
        chatBot.disconnect();
      }
    }
  }, []);

  const getComboCount = () => {
    return msgCount[authentication.getUserId()] || 0;
  };
  
  console.log("CLASS BEFORE RENDER: ", comboCountClass);
  if (finishedLoading && isVisible) {
    return <ComboCount key={Date.now()} count={getComboCount()} comboCountClass={comboCountClass}/>;
  } else {
    return (
      <div className="App">
      </div>
    );
  }
};