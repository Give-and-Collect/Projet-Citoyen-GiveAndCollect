import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EmailContent, MailOptions, CustomTransporter } from '../../../types/sendMail';
import fs from 'fs';
import path from 'path';

const CONTACT_MESSAGE_FIELDS: { [key: string]: string } = {
    name: 'Nom et Prénom',
    email: 'Email',
    subject: 'Object',
    message: 'Message',
};

const transporter: CustomTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
}) as CustomTransporter;

const generateEmailContent = (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    [key: string]: string;
}): EmailContent => {
    const orderedKeys = ['name', 'email', 'subject', 'message'];

    const stringData = orderedKeys.reduce(
        (str, key) =>
            (str += `${CONTACT_MESSAGE_FIELDS[key]}: \n${data[key]} \n \n`),
        ''
    );
    const htmlData = orderedKeys.reduce((str, key) => {
        return (str += `<h3 class="form-heading" align="left">${CONTACT_MESSAGE_FIELDS[key]}</h3><p class="form-answer" align="left">${data[key]}</p>`);
    }, '');

    const htmlTemplate = fs.readFileSync(path.resolve('./src/template/email.html'), 'utf8');

    const htmlContent = htmlTemplate.replace('${htmlData}', htmlData);

    return {
        text: stringData,
        html: htmlContent,
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message, subject } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ message: 'Bad request' }, { status: 400 });
        }

        const userEmail = process.env.EMAIL_USER;
        if (!userEmail) {
            throw new Error('EMAIL_USER environment variable is not defined');
        }

        const mailOptions: MailOptions & EmailContent = {
            from: userEmail,
            to: userEmail,
            subject: `${subject}`,
            ...generateEmailContent(body),
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Email sending failed' }, { status: 500 });
    }
}

