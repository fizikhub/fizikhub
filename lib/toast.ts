import { toast as sonnerToast } from "sonner";

// Success toast
export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, {
            description,
            duration: 4000,
        });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            duration: 5000,
        });
    },

    info: (message: string, description?: string) => {
        sonnerToast.info(message, {
            description,
            duration: 4000,
        });
    },

    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, {
            description,
            duration: 4500,
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        });
    },
};
