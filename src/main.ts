import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import i18n from '@/locale';
import store from '@/store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { injectGtag } from '@/utils/injectGtag';
import { gaDirectiveInstall } from '@/directive/ga';
import Toast, { PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import '@/styles/index.less';
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont.js';

injectGtag();

const app = createApp(App);
gaDirectiveInstall(app);
const options: PluginOptions = {
    closeOnClick: false,
    pauseOnHover: true
};
app.use(ElementPlus);
app.use(Toast, options);
app.use(router);
app.use(store);
app.use(i18n);
app.mount('#app');
