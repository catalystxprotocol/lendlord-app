import elementEn from 'element-plus/es/locale/lang/en';
import elementZhCn from 'element-plus/es/locale/lang/zh-cn';
import elementZhHK from 'element-plus/es/locale/lang/zh-tw';

export const useLayout = () => {
    const elementLocale = {
        en: elementEn,
        'zh-CN': elementZhCn,
        'zh-HK': elementZhHK
    };
    const currentLocale = ref('en');
    const locale = computed(() => elementLocale[currentLocale.value]);
    return {
        locale
    };
};
