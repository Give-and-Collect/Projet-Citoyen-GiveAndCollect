import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EmailContent, MailOptions, CustomTransporter } from '@/types/sendMail';
import fs from 'fs';
import path from 'path';

const CONTACT_MESSAGE_FIELDS: { [key: string]: string } = {
    name: 'Nom et Prénom',
    email: 'Email',
    subject: 'Objet',
    message: 'Message',
};

const transporter: CustomTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
}) as CustomTransporter;

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
    name: string;
    email: string;
    subject: string;
    message: string;
    [key: string]: string;
}): EmailContent => {
    const orderedKeys = ['name', 'email', 'subject', 'message'];

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
      
        // Valider et nettoyer les données
        const { name, email, message, subject } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }

        if ([name, subject, message, email].some(input => containsMaliciousPatterns(input))) {
            return NextResponse.json({ message: 'Invalid input detected' }, { status: 400 });
        }

        const userEmail = process.env.EMAIL_USER!;
        if (!userEmail) {
            throw new Error('EMAIL_USER environment variable is not defined');
        }

        const htmlTemplatePath = path.resolve('./src/template/email.html');
        const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

        const mailOptions: MailOptions & EmailContent = {
            from: userEmail,
            to: userEmail,
            subject: `${subject}`,
            html: htmlTemplate.replace('${htmlData}', generateEmailContent(body).html),
            text: generateEmailContent(body).text,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Email sending failed' }, { status: 500 });
    }
}
