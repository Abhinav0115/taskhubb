"use client";

import { useRef, useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { meta_details } from "@/lib/metaData";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { toast } from "react-toastify";
import Image from "next/image";

export default function PWAInstallPrompt() {
    const { isSupported, promptInstall, deferredPrompt, isInstalled } =
        usePWAInstall();

    const [showPrompt, setShowPrompt] = useState(false);
    const [maybeLater, setMaybeLater] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(
        typeof window !== "undefined" &&
            localStorage.getItem("pwa-hide") === "true"
    );

    const { resolvedTheme } = useNextTheme();
    const modalRef = useRef<HTMLDivElement>(null);

    // Show prompt when conditions are met
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                !maybeLater &&
                !dontShowAgain &&
                isSupported &&
                deferredPrompt &&
                !isInstalled
            ) {
                setShowPrompt(true);
            }
        }, 500); // 2-second delay

        return () => clearTimeout(timer);
    }, [isSupported, deferredPrompt, isInstalled, maybeLater, dontShowAgain]);

    // Handle clicking outside the modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setShowPrompt(false);
        }
        setMaybeLater(true);
    };

    const handleInstallClick = async () => {
        const result = await promptInstall();
        setShowPrompt(false);
    };

    const handleMaybeLaterClick = () => {
        toast.info("You can install later from the menu.");
        setShowPrompt(false);
        setMaybeLater(true);
    };

    const handleDontShowAgainClick = () => {
        toast.info("You won’t see this install prompt again.");
        localStorage.setItem("pwa-hide", "true");
        setDontShowAgain(true);
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={`rounded-xl shadow-lg p-6 px-4 pb-4 max-w-sm w-full border transition-all duration-300 ${
                    resolvedTheme === "dark"
                        ? "bg-gray-900 text-gray-100 border-gray-700"
                        : "bg-white text-gray-900 border-gray-300"
                }`}
            >
                <div className="flex items-center gap-4 mb-4">
                    <Image
                        src="/taskhubb-2.png"
                        alt="App Icon"
                        width={48}
                        height={48}
                        className="rounded-md"
                    />
                    <div>
                        <h2 className="text-lg font-semibold">
                            Install {meta_details.shortTitle}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get quick access and offline support.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <button
                        onClick={handleDontShowAgainClick}
                        className="text-sm text-red-500 opacity-60 hover:text-red-600 underline cursor-pointer"
                    >
                        Don’t Show Again
                    </button>
                    <button
                        onClick={handleMaybeLaterClick}
                        className="text-sm text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 opacity-60 underline cursor-pointer"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-medium px-4 py-2 rounded  cursor-pointer"
                    >
                        Install App
                    </button>
                </div>
            </div>
        </div>
    );
}
