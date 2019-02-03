import Vue from 'vue';
import Vuex from 'vuex';
import {http} from '../http';
import {ProjectionsModule} from './projections';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    connected: false, // websocket connection state
    http,
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.connected = true; // eslint-disable-line no-param-reassign
    },
    SOCKET_DISCONNECT(state) {
      state.connected = false; // eslint-disable-line no-param-reassign
    },
  },
  modules: {
    projections: ProjectionsModule,
  },
});

export default store;
