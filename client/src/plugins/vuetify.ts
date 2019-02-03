import Vue from 'vue';
import Vuetify, {VLayout} from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {VLayout},
  theme: {
    primary: colors.blue.base,
    secondary: colors.lime.base,
    accent: colors.orange.base,
    error: colors.red.base,
    warning: colors.yellow.base,
    info: colors.blue.base,
    success: colors.green.base,
  },
});
