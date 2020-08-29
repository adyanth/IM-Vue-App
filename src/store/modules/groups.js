import Vue from 'vue';

export default {
    namespaced: true,
    state: {
        list: [],
        messages: {},
    },
    mutations: {
        newMessage: (state, { group, from, msg }) => {
            console.log(group, from, msg)
            if(!state.list.includes(group)) {
                console.log(`[WARN] Message from unsubscribed group: ${group}, dropping nessage: ${message}`);
                return;
            }
            if(!state.messages[group]) {
                Vue.set(state.messages, group, []);
            }
            const message = {from: from, ...msg};
            console.log(message);
            state.messages[group].push(message);
        },
        newGroup: (state, group) => {
            if(!state.list.includes(group)) {
                state.list.push(group);
            }
        },
    },
    getters: {
        messages: state => group => state.messages[group],
        groups: state => state.list,
    },
    actions: {

    }
}
