export { };

declare global {
    interface Window {
        umami: {
            track: (eventName: string, eventData?: Record<string, any>) => void;
            identify: (userData: Record<string, any>) => void;
        };
    }
}
