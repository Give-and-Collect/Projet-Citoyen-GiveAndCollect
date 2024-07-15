import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';
import nodemailer from 'nodemailer';

jest.mock('nodemailer'); // Mock nodemailer for tests

describe('POST /api/contact', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Test sending email with missing data fields', async () => {
        const postData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            subject: 'Test Subject',
            // The "message" field is intentionally missing
        };

        const request = new NextRequest('http://localhost/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.message).toBe('Bad request');
    });

    it('Test sending email with malicious input', async () => {
        const postData = {
            name: '<script>alert(\'XSS\')</script>',
            email: 'john.doe@example.com',
            subject: 'Test Subject',
            message: 'This is a test message.',
        };

        const request = new NextRequest('http://localhost/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.message).toBe('Invalid input detected');
    });

    it('Test sending email when EMAIL_USER environment variable is not defined', async () => {
        const postData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            subject: 'Test Subject',
            message: 'This is a test message.',
        };

        const request = new NextRequest('http://localhost/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        process.env.EMAIL_USER = ''; // Simulate undefined EMAIL_USER environment variable

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.message).toBe('Email sending failed');
    });
});
