import Vue from 'vue';
import Vuex from 'vuex';
import {http} from '../http';
import {kidLocationProjectionModule} from './projections';
import createFirestoreModules from 'vuex-easy-firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(Vuex);

firebase.initializeApp({
  projectId: 'pnc-check-in-dev',
  databaseUrl: 'https://pnc-check-in-dev.firebaseio.com',
  apiKey: 'AIzaSyAoj4x7_663aSisQK1lUYe4nYLzqXvu1tY',
});

const firestoreModules = createFirestoreModules([kidLocationProjectionModule], {logging: true});

const store = new Vuex.Store({
  plugins: [firestoreModules],
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
});

store.dispatch('kidsByLocation/openDBChannel');

export default store;
