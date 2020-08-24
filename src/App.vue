<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="amber"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5">MQTT&nbsp;<span class="font-weight-light">Chat</span></span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="search"
      ></v-text-field>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
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
          ></v-divider>
          <v-list-item
            v-else
            :key="items.length * 2 + i"
            link
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

    <v-main>
      <v-container
        fluid
        class="grey lighten-4 fill-height"
      >
        <HelloWorld/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from '@/components/HelloWorld';

export default {
  components: {
    HelloWorld,
  },
  created () {
    this.loadItems();
  },
  data: () => ({
    drawer: null,
    groups: [{ icon: 'lightbulb_outline', text: 'G1' }],
    chats: [{ icon: 'add', text: 'P1' }],
    items: [],
  }),
  methods: {
    loadItems() {
      this.items = [
        { heading: 'Groups' },
        ...this.groups,
        { divider: true },
        { heading: 'Chats' },
        ...this.chats,
        { divider: true },
        { icon: 'lightbulb_outline', text: 'Notes' },
        { icon: 'touch_app', text: 'Reminders' },
        { divider: true },
        { icon: 'archive', text: 'Archive' },
        { icon: 'delete', text: 'Trash' },
        { divider: true },
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Keyboard shortcuts' },
      ]
    }
  },
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
