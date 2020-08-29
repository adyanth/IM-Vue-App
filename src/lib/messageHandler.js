import store from '../store';
import { NAMESPACE } from './config';

const userHandler = (topicList, payloadString) => {
    const user = store.getters.userID;

    const target = topicList.splice(0, 1)[0];
    if(target === user) {
        const action = topicList.splice(0, 1)[0];
        const msg = JSON.parse(payloadString);
        switch(action) {
            case 'status': 
                store.commit('setStatus', msg);
                break;
            case 'message': 
                const from = topicList.splice(0, 1)[0];
                store.commit('users/newMessage', { from, msg });
                break;
            default:
                console.log(`Unknown action: ${action}, ${topicList}`);
        }
    } else {
        console.log(`[WARN] Listening to other users: ${topic}, dropping message: ${payloadString}`);
        return;
    }
};

const groupHandler = (topicList, payloadString) => {
    const group = topicList.splice(0, 1)[0];
    const action = topicList.splice(0, 1)[0];
    const msg = JSON.parse(payloadString);
    switch(action) {
        case 'message': 
            const from = topicList.splice(0, 1)[0];
            store.commit('groups/newMessage', { group, from, msg });
            break;
        default:
            console.log(`Unknown action: ${action}, ${topicList}`);
    }
};

const handler = {
    user: userHandler,
    group: groupHandler,
}

const messageHandler = (data) => {
    const { topic, payloadString} = data;
    const topicList = topic.split('/');
    NAMESPACE.split('/').forEach((sub, i) => {
        if(topicList[i] === sub) {
            topicList.splice(i, 1);
        } else {
            console.log(`[WARN] Listening to topic outside NAMESPACE: ${topic}, dropping message: ${payloadString}`);
            return;
        }
    });
    // console.log(`Topic List: ${topicList}, Payload: ${payloadString}`);
    const instance = topicList.splice(0, 1);
    const handlerInstance = handler[instance];
    if(!handlerInstance) {
        console.log(`[ERR] No handlers for ${instance}, dropping message: ${payloadString}`);
        return;
    }
    handlerInstance(topicList, payloadString);
    return;
}


export default {
    handle: messageHandler,
}