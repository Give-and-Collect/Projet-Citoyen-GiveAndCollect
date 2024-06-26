import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EmailContent } from '@/types/sendMail'; // Assurez-vous que ce chemin est correct pour vos types
import fs from 'fs';
import path from 'path';

const CONTACT_MESSAGE_FIELDS: { [key: string]: string } = {
    subject: 'Objet',
    message: 'Message',
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});

const sanitizeInput = (input: string): string => {
    return input.replace(/['"<>]/g, '');
};

const containsMaliciousPatterns = (input: string): boolean => {
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

const generateEmailContent = (data: {
    firstname: string;
    email: string;
    subject: string;
    message: string;
    [key: string]: string;
}): EmailContent => {
    const orderedKeys = ['firstname', 'email', 'subject', 'message'];

    const htmlData = orderedKeys.reduce((str, key) => {
        return (str += `<h3>${CONTACT_MESSAGE_FIELDS[key]}</h3><p>${sanitizeInput(data[key])}</p>`);
    }, '');

    const textData = orderedKeys.reduce(
        (str, key) =>
            (str += `${CONTACT_MESSAGE_FIELDS[key]}: ${sanitizeInput(data[key])}\n\n`),
        ''
    );

    return {
        text: textData,
        html: htmlData,
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('Request Body:', body);

        const { subject, message, authorEmail, userConnectedEmail, userConnectedFirstName } = body;

        console.log('Subject:', subject);
        console.log('Message:', message);
        console.log('authorEmail:', authorEmail);

        if (!subject || !message || !authorEmail || !userConnectedEmail || !userConnectedFirstName) {
            console.log('Missing required fields:', { subject, message});
            return NextResponse.json({ message: 'Bad request - Missing required fields' }, { status: 400 });
        }

        if ([subject, message, authorEmail, userConnectedEmail, userConnectedFirstName].some(input => containsMaliciousPatterns(input))) {
            console.log('Invalid input detected:', { subject, message, userConnectedEmail ,userConnectedFirstName});
            return NextResponse.json({ message: 'Invalid input detected' }, { status: 400 });
        }

        const emailContent = generateEmailContent({ firstname: userConnectedFirstName, email: userConnectedEmail,subject: subject,message: message });

        const htmlTemplatePath = path.resolve('./src/template/email.html');
        const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

        const mailOptions = {
            from: process.env.EMAIL_USER!,
            to: authorEmail,//authorEmail
            subject: `${subject}`,
            html: htmlTemplate.replace('${htmlData}', emailContent.html),
            text: emailContent.text,
        };

        await transporter.sendMail(mailOptions);

        console.log('Email sent successfully to:', authorEmail);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Email sending failed' }, { status: 500 });
    }
}
