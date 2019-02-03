<template>
  <v-container fluid grid-list-md>
    <v-data-iterator
      :items="kidsByLocation"
      content-tag="v-layout"
      item-key="locationId"
      hide-actions
      row
      wrap
    >
      <v-flex slot="item" slot-scope="props" xs12 sm6 md3 lg2>
        <v-card>
          <v-card-title>
            <h4>{{ props.item.locationId }}</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-list dense :key="kid" v-for="kid in props.item.kids">
            <v-list-tile>
              <v-list-tile-content>{{ kid }}</v-list-tile-content>
              <v-list-tile-content class="align-end">STUFF</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {namespace, Getter} from 'vuex-class';
import * as R from 'ramda';
import {KidLocation} from '../../../core/dist';

const projections = namespace('/projections');

@Component
export default class KidsByLocationTables extends Vue {
  // @projections.Getter('kidLocations') private kidLocations: KidLocation[] = [];

  get kidsByLocation() {
    return [
      {locationId: 'oppppop', kids: ['you', 'sue', 'bob']},
      {locationId: 'sdflsdf', kids: ['yodu', 'suefd', 'bob']},
      {locationId: 'hahha', kids: ['ydfdou', 'ssdfdue', 'sdfsdf']},
    ];
    // const sortByLoc = R.groupBy((k: KidLocation) => k.locationId);
    // return sortByLoc(this.kidLocations);
  }
}
</script>
