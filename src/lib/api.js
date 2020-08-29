import Paho from 'paho-mqtt';
import store from '../store';

import { NAMESPACE, MOSQUITTO_SERVER, MOSQUITTO_PORT } from './config';
import messageHandler from './messageHandler';

var client = undefined;

const init = (userid) => {
  store.commit('setUser', userid);
  
  const user = userid;
  client = new Paho.Client(MOSQUITTO_SERVER, MOSQUITTO_PORT, user);
  client.onConnectionLost = function (responseObject) {
      console.log("[WARN] Connection Lost: "+responseObject.errorMessage);
      store.commit('setStatus', {});
  };

  client.onMessageArrived = function (data) {
    const { topic, payloadString: msg} = data;
    console.log(`Message Arrived: ${topic}: ${msg}`);
    messageHandler.handle(data);
  };

  // Connect the client, providing an onConnect callback
  client.connect({
    onSuccess: () => {
      const user = store.getters.userID;

      console.log("Connected, subscribing!");
      client.subscribe(`${NAMESPACE}/user/${user}/#`);
      setStatus('active');
    }
  });
}

const send = (topic, data) => {
  const sendTopic = `${NAMESPACE}/${topic}`;
  if(!client) {
    throw "[ERR] Client not yet initialized! Please run api.init(<userID>) before calling send!"
  }
  client.publish(sendTopic, JSON.stringify(data));
  console.log(`Message Sent: ${sendTopic}: ${JSON.stringify(data)}`);
};

const sendMessage = (to, msg) => {
  const from = store.getters.userID;

  const dest = `user/${to}/message/${from}`;
  const data = {
    msg: msg,
    time: Date.now(),
  };
  send(dest, data);
};

const sendGroupMessage = (to, msg) => {
  const from = store.getters.userID;

  const dest = `group/${to}/message/${from}`;
  const data = {
    msg: msg,
    time: Date.now(),
  };
  send(dest, data);
};

const setStatus = (status) => {
  const user = store.getters.userID;
  const dest = `user/${user}/status`;
  const data = {
    status: status,
    time: Date.now(),
  }
  send(dest, data);
}

const subscribeGroup = (group) => {
  const dest = `${NAMESPACE}/group/${group}/#`; 
  client.subscribe(dest);
  store.commit('groups/newGroup', group);
  console.log(`Subscribed to ${group}`);
};

export default {
  init,
  send,
  user: {
    send: sendMessage,
  },
  group: {
    subscribe: subscribeGroup,
    send: sendGroupMessage
  },
  status: {
    set: setStatus,
  }
}
