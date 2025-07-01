import { Toaster, toast } from "sonner";

// Define supported variants
type ToastVariant = "default" | "success" | "error" | "info";

// Define function signature
type ShowToast = (message: string, variant?: ToastVariant, duration?: number) => void;

const useToastNotification = (): ShowToast => {
    const showToast: ShowToast = (message, variant = "success", duration = 2000) => {
        const toastOptions = {
            default: {
                title: "Notification",
                description: message,
                duration,
            },
            success: {
                title: "Success",
                description: message,
                duration,
                variant: "success",
            },
            error: {
                title: "Error",
                description: message,
                duration,
                variant: "error",
            },
            info: {
                title: "Information",
                description: message,
                duration,
                variant: "info",
            },
        };

        const options = toastOptions[variant] || toastOptions.default;
        const { title, description } = options;

        toast[variant]?.(`${title}: ${description}`);
    };

    return showToast;
};

export default useToastNotification;


export const ToastNotificationProvider = () => (
    <Toaster richColors position="top-right" />
);


