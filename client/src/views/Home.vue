<template>
  <div>🐩
    <KidsByLocationTables/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import KidsByLocationTables from '../components/kids-by-location-tables.vue';

@Component({
  components: {
    KidsByLocationTables,
  },
})
export default class Home extends Vue {}
</script>
