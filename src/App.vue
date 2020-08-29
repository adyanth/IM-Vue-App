<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="amber"
    >
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
    <SideBar />
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
import SideBar from '@/components/SideBar';

import api from '@/lib/api';

export default {
  components: {
    HelloWorld, SideBar
  },
  created () {
    api.init('adyah');
  },
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
