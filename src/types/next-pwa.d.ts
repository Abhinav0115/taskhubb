// next-pwa.d.ts
declare module "next-pwa" {
    import type { NextConfig } from "next";

    interface PWAOptions {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        buildExcludes?: (string | RegExp)[];
        runtimeCaching?: any[];
        // Add other options here if you want
    }

    function withPWA(
        pwaOptions: PWAOptions
    ): (nextConfig: NextConfig) => NextConfig;

    export default withPWA;
}
