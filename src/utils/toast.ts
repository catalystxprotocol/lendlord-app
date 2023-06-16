import { createToastInterface } from 'vue-toastification';
import ToastComponent from '@/components/ToastComponent.vue';
import ToastClose from '@/components/ToastClose.vue';

const pluginOptions: any = {
    position: 'top-right',
    timeout: 3000, // 3秒自动消失
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: false,
    draggablePercent: 0,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    icon: false
};
const toast = createToastInterface(pluginOptions);
// import { toastStatusEnum } from "@/constants/index"
export class MyToast {
    static submitResult(status: string, text?: string, explorerUrl?: string) {
        toast(
            {
                component: ToastComponent,
                props: {
                    status, // toastStatusEnum 枚举 success / processing / failed
                    text,
                    explorerUrl
                }
            },
            {
                closeButton: ToastClose
            }
        );
    }

    static clear() {
        toast.clear();
    }
}
