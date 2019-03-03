import * as R from 'ramda';
import {Module, VuexModule, MutationAction} from 'vuex-module-decorators';
import {KidLocation} from '@core';

export type KidsByLocation = {
  locationId: string;
  kids: string[];
}[];

@Module({namespaced: true, name: 'projections'})
export class ProjectionsModule extends VuexModule {
  kidLocations: KidLocation[] = [
    {locationId: 'some location', kidId: 'bart'},
    {locationId: 'some location', kidId: 'lisa'},
    {locationId: 'some location', kidId: 'homer'},
    {locationId: 'other location', kidId: 'doug'},
    {locationId: 'other location', kidId: 'sarah'},
    {locationId: 'other location', kidId: 'katie'},
  ];

  get kidsByLocation(): KidsByLocation {
    const grouped = R.groupBy((k: KidLocation) => k.locationId)(this.kidLocations);
    return Object.keys(grouped).map(locId => {
      return {
        locationId: locId,
        kids: grouped[locId].map(l => l.kidId),
      };
    });
  }

  // @MutationAction({mutate: ['kidLocations']})
  // async fetchKidLocations() {
  //   const {data: kidLocations} = await http.get('/kids/location');
  //   return kidLocations;
  // }
}
