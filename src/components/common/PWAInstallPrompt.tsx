"use client";

import { useRef, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { meta_details } from "@/lib/metaData";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { toast } from "react-toastify";

export default function PWAInstallPrompt() {
    const { isSupported, promptInstall, deferredPrompt, isInstalled } =
        usePWAInstall();

    const [showPrompt, setShowPrompt] = useState(false);
    const { resolvedTheme } = useNextTheme();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only show modal if not manually triggered
        if (isSupported && deferredPrompt && !isInstalled) {
            setShowPrompt(true);
        }
    }, [isSupported, deferredPrompt, isInstalled]);

    const handleInstallClick = async () => {
        const result = await promptInstall();
        setShowPrompt(false);
        if (!result.success) {
            toast.info("You can install later from the menu.");
        } else {
            toast.success("App installed successfully!");
        }
        // console.log(result.success ? "User accepted" : "User dismissed");
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setShowPrompt(false);
        }
    };

    const handleMaybeLaterClick = () => {
        setShowPrompt(false);
        toast.info("You can install later from the menu.");
        toast.info("Install prompt dismissed.");
    };

    if (!showPrompt) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
                role="dialog"
                aria-modal="true"
                onClick={handleBackdropClick}
            >
                <div
                    ref={modalRef}
                    className={`${
                        resolvedTheme === "dark"
                            ? "bg-gray-900 text-gray-100 border-gray-700"
                            : "bg-gray-100 text-gray-900 border-gray-400/40"
                    } rounded-lg shadow-xl p-6 px-4 pb-4 max-w-sm w-full border`}
                >
                    <p className="mb-4 text-base font-medium">
                        Install{" "}
                        <span className="text-purple-800 dark:text-purple-400 font-semibold underline">
                            {meta_details.shortTitle}
                        </span>{" "}
                        app on your device
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleMaybeLaterClick}
                            className={`${
                                resolvedTheme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                            } text-sm hover:underline cursor-pointer`}
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleInstallClick}
                            className="bg-purple-700 cursor-pointer hover:bg-purple-800 text-white text-sm px-4 py-2 rounded"
                        >
                            Install
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
