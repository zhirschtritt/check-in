import {IConfig} from 'vuex-easy-firestore/types/module/defaultConfig';
import {KidsByLocation} from '@core';

export const kidLocationProjectionModule: IConfig = {
  firestorePath: 'kids-by-location-projection',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'kidsByLocation',
  statePropName: 'data',
  getters: {
    kidsByLocation: (state: any): KidsByLocation[] => {
      return Object.values(state.data);
    },
  },
};
