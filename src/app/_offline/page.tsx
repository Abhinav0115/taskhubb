// src/app/_offline/page.tsx
export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Offline</h1>
            <p className="text-lg">
                You&apos;re currently offline. Please check your internet connection
                and try again.
            </p>
        </div>
    );
}
