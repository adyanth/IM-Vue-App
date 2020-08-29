import Vue from 'vue';

export default {
    namespaced: true,
    state: {
        list: [],
        messages: {},
    },
    mutations: {
        newMessage: (state, { from, msg }) => {
            if(state.list.indexOf(from) === -1) {
                state.list.push(from);
            }
            if(!state.messages[from]) {
                Vue.set(state.messages, from, []);
            }
            state.messages[from].push(msg);
        },
        newUser: (state, user) => {
            state.list.push(user);
        },
    },
    getters: {
        messages: state => user => state.messages[user],
        users: state => state.list,
    },
    actions: {

    }
}
