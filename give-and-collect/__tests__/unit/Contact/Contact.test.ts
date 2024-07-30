import { containsMaliciousPatterns } from '@/app/about/page';

describe('containsMaliciousPatterns', () => {
    it('should return true for input containing <script> tag', () => {
        const input = '<script>alert("XSS")</script>';
        expect(containsMaliciousPatterns(input)).toBe(true);
    });

    it('should return true for input containing onerror attribute', () => {
        const input = '<img src="invalid-image" onerror="alert(\'XSS\')" />';
        expect(containsMaliciousPatterns(input)).toBe(true);
    });

    it('should return true for input containing SQL injection pattern', () => {
        const input = "' OR '1'='1";
        expect(containsMaliciousPatterns(input)).toBe(true);
    });

    it('should return true for input containing a URL', () => {
        const input = 'http://example.com';
        expect(containsMaliciousPatterns(input)).toBe(true);
    });

    it('should return false for safe input', () => {
        const input = 'Hello, this is a safe message!';
        expect(containsMaliciousPatterns(input)).toBe(false);
    });

    it('should return false for input with special characters but no malicious patterns', () => {
        const input = 'Hello, this message contains special characters like @#&*()!';
        expect(containsMaliciousPatterns(input)).toBe(false);
    });
});
