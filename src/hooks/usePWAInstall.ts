// hooks/usePWAInstall.ts
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [wasPromptUsed, setWasPromptUsed] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            if (!wasPromptUsed) {
                setDeferredPrompt(e);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, [wasPromptUsed]);

    useEffect(() => {
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("appinstalled", handleAppInstalled);
        return () =>
            window.removeEventListener("appinstalled", handleAppInstalled);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) {
            toast.info("Install prompt not available. Please reload the page.");
            return { success: false };
        }

        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;

        // You cannot reuse the prompt again — clear it
        setDeferredPrompt(null);
        setWasPromptUsed(true); // Prevent future prompts until new event fires
        
        if (result.outcome === "dismissed") {
            toast.info(
                "Install prompt dismissed. You can install later from the menu."
            );
        } else {
            toast.success("App installed successfully!");
        }

        return {
            success: result.outcome === "accepted",
            outcome: result.outcome,
        };
    };

    return {
        isSupported: !isInstalled && !!deferredPrompt && !wasPromptUsed,
        promptInstall,
        deferredPrompt,
        isInstalled,
    };
}
