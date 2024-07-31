export const containsMaliciousPatterns = (input: string): boolean => {
    const patterns = [
        /<script.*?>.*?<\/script.*?>/i,
        /<.*?onerror=.*?>/i,
        /' OR '1'='1/i,
        /;.*--/i,
        /https?:\/\/[^\s]+/i,
        /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i,
        /&#x3C;.*?&#x3E;/i
    ];
    return patterns.some(pattern => pattern.test(input));
};