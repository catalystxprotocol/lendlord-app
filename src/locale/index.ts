import { createI18n } from 'vue-i18n';
import en from './en';
// 文件夹如果是zh-CN,运维的构建环境会报错，找不到模块
import zhCN from './zhCN';
import zhHk from './zhHK';
import elementEn from 'element-plus/es/locale/lang/en';
import elementZhCN from 'element-plus/es/locale/lang/zh-cn';
import elementZhHk from 'element-plus/es/locale/lang/zh-tw';

const messages = {
    'zh-CN': { ...zhCN, ...elementZhCN },
    'zh-HK': { ...zhHk, ...elementZhHk },
    en: { ...en, ...elementEn }
};

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages
});

export default i18n;
