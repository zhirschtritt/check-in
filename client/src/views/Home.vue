<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <v-btn @click="onClick()">INCREMENT</v-btn>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
  message: string = 'fuck';

  onClick() {
    console.log(this.message);
  }
}
</script>
