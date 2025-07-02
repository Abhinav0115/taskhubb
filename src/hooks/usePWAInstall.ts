// hooks/usePWAInstall.ts
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

let hasManuallyTriggered = false; // Track if the user has manually triggered the install prompt

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [hasPromptFired, setHasPromptFired] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();

            // Check if the prompt has already been manually triggered
            if (!hasManuallyTriggered) {
                setDeferredPrompt(e);
                setHasPromptFired(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    useEffect(() => {
        const handleAppInstalled = () => {
            console.log("PWA installed");
            setIsInstalled(true);
            // Clear the prompt
            setDeferredPrompt(null);
        };

        window.addEventListener("appinstalled", handleAppInstalled);
        return () =>
            window.removeEventListener("appinstalled", handleAppInstalled);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return { success: false };

        hasManuallyTriggered = true;
        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;

        // Reset the prompt state
        setDeferredPrompt(null);
        setHasPromptFired(false);

        if (!result.success) {
            toast.info("You can install later from the menu.");
            toast.info("Install prompt dismissed.");
        }

        return {
            success: result.outcome === "accepted",
            outcome: result.outcome,
        };
    };

    return {
        isSupported: !isInstalled && (hasPromptFired || !!deferredPrompt),
        promptInstall,
        deferredPrompt,
        isInstalled,
    };
}
