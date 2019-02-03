<template>
  <v-app>
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>
<style lang="stylus">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
