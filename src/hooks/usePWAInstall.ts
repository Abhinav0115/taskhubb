import { useEffect, useState, useRef } from "react";

let hasManuallyTriggered = false; // Track if the user has manually triggered the install prompt
const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_COOLDOWN_MINUTES = 1;

function minutesSince(dateStr: string) {
    const then = new Date(dateStr);
    const now = new Date();
    return (now.getTime() - then.getTime()) / (1000 * 60);
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [hasPromptFired, setHasPromptFired] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();

            const lastDismissed = localStorage.getItem(DISMISS_KEY);
            const tooSoon =
                lastDismissed &&
                minutesSince(lastDismissed) < DISMISS_COOLDOWN_MINUTES;

            if (tooSoon) return;

            setDeferredPrompt(e);
            setHasPromptFired(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    useEffect(() => {
        const handleAppInstalled = () => {
            // console.log("PWA installed");
            setIsInstalled(true);
            // Clear the prompt
            setDeferredPrompt(null);
            localStorage.removeItem(DISMISS_KEY);
        };

        window.addEventListener("appinstalled", handleAppInstalled);
        return () =>
            window.removeEventListener("appinstalled", handleAppInstalled);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return { success: false };

        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;

        // Reset the prompt state
        setDeferredPrompt(null);
        setHasPromptFired(false);

        if (result.outcome === "dismissed") {
            localStorage.setItem(DISMISS_KEY, new Date().toISOString());
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
