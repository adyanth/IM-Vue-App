<template>
  <v-navigation-drawer
  app
  mobile-breakpoint="0"
  clipped
  color="grey lighten-4"
  >
    <v-list
    dense
    class="grey lighten-4"
    >
      <template v-for="(item, i) in items">
        <v-row
        v-if="item.heading"
        :key="i"
        align="center"
        >
          <v-col cols="6">
            <v-subheader v-if="item.heading">
            {{ item.heading }}
            </v-subheader>
          </v-col>
        </v-row>
        <v-divider
        v-else-if="item.divider"
        :key="items.length + i"
        dark
        class="my-4"
        >
        </v-divider>
        <v-list-item
        v-else
        :key="items.length * 2 + i"
        link
        @click="item.click ? item.click() : undefined"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import api from '@/lib/api';
import { mapGetters } from 'vuex'

export default {
  name: 'SideBar',
  created () {
    console.log('Starting time loop!');

    // Time interval betweeen sending status update
    this.timeLoopID = setInterval(this.timeLoop, 60 * 1000);
  },
  computed: {
    ...mapGetters([
      'userID',
      'status'
    ]),
    ...mapGetters('users', {
      usersList: 'users',
    }),
    ...mapGetters('groups', {
      groupsList: 'groups',
      groupMessages: 'messages'
    }),
    items() {
      const status = [this.statusComponent(this.status)]
      const groups = [
        { heading: 'Groups' },
        ...this.groups,
        { divider: true },
      ];
      const users = [
        { heading: 'Chats' },
        ...this.users,
        { divider: true },
      ];
      const options = this.options;
      return [].concat(status, groups, users, options)
    },
    users() {
      return this.usersList.map(element => {
        return { icon: 'add', text: element };
      });
    },
    groups() {
      return this.groupsList.map(element => {
        return { icon: 'lightbulb_outline', text: element };
      });
    }
  },
  data () {
    return {
      now: Date.now(),
      timeLoopID: null,
      options: [
        { icon: 'lightbulb_outline', text: 'Notes' },
        { icon: 'touch_app', text: 'Subscribe to group', click: () => {
          api.group.subscribe('Test Group');
        } },
        { icon: 'archive', text: 'Send test group message', click: () => {
          api.group.send('Test Group', 'Hi group!!!');
        } },
        { icon: 'archive', text: 'Send myself a message', click: () => {
          api.user.send(this.userID, 'Hi person!!!');
        } },
        { icon: 'delete', text: 'Trash' },
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Keyboard shortcuts' },
      ],
    }
  },
  methods: {
    timeLoop() {
      console.log('Time loop!')
      this.now = Date.now();
      api.status.set('active');
    },
    statusComponent(statusObj) {
      console.log(statusObj);
      const timeLastMin = Math.round( (this.now - statusObj.time) / (60 * 1000) );

      // Time in minutes after which away status is shown
      const nowBreakMin = 10;

      const statusType = statusObj.status ? 
        timeLastMin < nowBreakMin ?
          statusObj.status : 'away'
        : null;
      const timeAgo = statusObj ? 
        timeLastMin > 24 * 60 ?
          new Date(statusObj.time).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
          }) : timeLastMin > 90 ?
          `around ${Math.round(timeLastMin/60)} hours ago` : timeLastMin > nowBreakMin ? 
          `${timeLastMin} minutes ago` : 'now' : null;
      ;
      return {
        null: { icon: 'report_problem', text: 'Not connected!' },
        active: { icon: 'check_circle_outline', text: 'Status: Active' },
        away: { icon: 'directions_run', text: `Last seen ${timeAgo}` }
      }[statusType]
    },
  },
  destroyed () {
    console.log('Killing time loop...');
    clearInterval(this.timeLoopID);
  },
}
</script>

<style>

</style>