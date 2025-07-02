import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

const pwaOptions = {
    dest: "public",
    runtimeCaching,
    register: true,
    skipWaiting: true,
    fallbacks: {
        // This will serve the offline page when the user is offline and tries to access a page
        // You need to create this offline page and make sure it gets copied to public/
        // In Next.js App Router, the offline page can be a static export under public or handled differently.
        // For now, assuming you want to use /_offline route you defined:
        document: "/_offline",
    },
};

const nextConfig = {
    reactStrictMode: true,
    // other Next.js options
};

export default withPWA(pwaOptions)(nextConfig);
