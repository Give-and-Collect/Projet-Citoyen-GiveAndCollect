import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EmailContent } from '@/types/sendMail';
import fs from 'fs';
import path from 'path';

const CONTACT_MESSAGE_FIELDS: { [key: string]: string } = {
    firstname: 'Prénom',
    subject: 'Objet',
    message: 'Message',
    email: 'Voici mon adresse Mail',
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
    subject: string;
    message: string;
    email: string;
    [key: string]: string;
}): EmailContent => {
    const orderedKeys = ['firstname', 'subject', 'message', 'email'];

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

        const { subject, message, authorEmail, userConnectedEmail, userConnectedFirstName } = body;


        if (!subject || !message || !authorEmail || !userConnectedEmail || !userConnectedFirstName) {
            return NextResponse.json({ message: 'Bad request - Missing required fields' }, { status: 400 });
        }

        if ([subject, message, authorEmail, userConnectedEmail, userConnectedFirstName].some(input => containsMaliciousPatterns(input))) {
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

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Email sending failed' }, { status: 500 });
    }
}
