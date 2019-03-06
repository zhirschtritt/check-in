<template>
  <v-container fluid grid-list-md>
    <v-data-iterator
      :items="kidsByLocation"
      content-tag="v-layout"
      item-key="id"
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
              <v-icon>face</v-icon>
              <v-list-tile-content class="pl-1">{{ kid }}</v-list-tile-content>
              <v-list-tile-content class="align-end">
                <v-icon>more_vert</v-icon>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {namespace, Getter} from 'vuex-class';
import {KidsByLocation} from '../../../core/src';

const kidsByLocation = namespace('kidsByLocation');

@Component
export default class KidsByLocationTables extends Vue {
  @kidsByLocation.Getter('kidsByLocation') kidsByLocation: KidsByLocation[];
}
</script>
