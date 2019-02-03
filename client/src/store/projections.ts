import {Module, VuexModule, MutationAction} from 'vuex-module-decorators';
import {http} from '../http';
import {KidLocation} from '../../../core/dist';
import * as R from 'ramda';

@Module({namespaced: true, name: 'projections'})
export class ProjectionsModule extends VuexModule {
  kidLocations: KidLocation[] = [];

  get kidsByLocation() {
    return R.groupBy((k: KidLocation) => k.locationId)(this.kidLocations);
  }

  @MutationAction({mutate: ['kidLocations']})
  async getKidLocations() {
    const {data: kidLocations} = await http.get('/kids/location');
    return kidLocations;
  }
}
