import {Module, VuexModule, MutationAction} from 'vuex-module-decorators';
import {http} from '../http';

@Module
export class ProjectionsModule extends VuexModule {
  readonly _kidLocations: any = [];

  get kidLocations(): any {
    return this._kidLocations;
  }

  @MutationAction({mutate: ['_kidLocations']})
  async fetchAll() {
    const {data: kidLocations} = await http.get('/kids/locations');
    return kidLocations;
  }
}
