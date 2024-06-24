// types/sendMail.ts
import { SendMailOptions, Transporter } from 'nodemailer';

export interface EmailContent {
    text: string;
    html: string;
}

export interface MailOptions extends SendMailOptions {
    from: string;
    to: string;
    subject: string;
}

export interface CustomTransporter extends Transporter {
    sendMail(options: MailOptions & EmailContent): Promise<any>;
}


declare module 'nodemailer';
