"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isInstalled, promptInstall } = usePWAInstall();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInstallClick = async () => {
        const success = await promptInstall();
        // if (!success) {
        //     alert("Install prompt not available yet.");
        // }
    };

    if (!mounted) return null;
    return (
        <nav
            className={`bg-purple-900 p-4 py-2  ${
                theme === "dark"
                    ? "shadow-xs shadow-gray-300"
                    : "shadow-sm  shadow-gray-700"
            }`}
        >
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <Image
                        src="/taskhubb-2.png"
                        alt="TaskHubb Logo"
                        width={50}
                        height={50}
                        className="rounded-xl"
                        aria-label="TaskHubb Logo"
                        aria-details="TaskHubb Logo - A task management application"
                        aria-description="A logo for TaskHubb, a task management application."
                        loading="lazy"
                    />
                </div>

                <div
                    className="text-white text-3xl font-bold"
                    aria-label="Task Hubb"
                    aria-details="Task Hubb - A task management application"
                    aria-description="Task Hubb helps you manage your tasks efficiently."
                >
                    <span className="text-yellow-300 ">Task</span> Hubb
                </div>

                <div className="flex items-center gap-4">
                    {/* PWA Install Button */}
                    {!isInstalled && (
                        <button
                            onClick={handleInstallClick}
                            className="p-1 px-3 outline-1 outline-gray-200 text-gray-200 hover:outline-gray-300 rounded-md transition-colors duration-300 hover:bg-white/10 cursor-pointer"
                        >
                            Install App
                        </button>
                    )}

                    {/* Theme toggle button */}
                    <button
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="p-1 px-3 outline-1 outline-gray-200 text-gray-200 hover:outline-gray-300 rounded-md transition-colors duration-300 hover:bg-white/10 cursor-pointer"
                        aria-label="Toggle theme"
                        aria-pressed={theme === "dark"}
                        aria-details="Toggle between light and dark themes"
                    >
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
