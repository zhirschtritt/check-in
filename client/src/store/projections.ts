import {IConfig} from 'vuex-easy-firestore/types/module/defaultConfig';
import {KidsByLocation} from '@core';

export const kidLocationProjectionModule: IConfig = {
  firestorePath: 'kids-by-location-projection',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'kidsByLocation',
  statePropName: 'data',
  getters: {
    kidsByLocation: (state: any): KidsByLocation[] => {
      return Object.entries(state.data as KidsByLocation).map(v => {
        return {...v[1], id: v[0]};
      });
    },
  },
};
