import prisma from "@/utils/db";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest, { params }: { params: { email: string } }) {
    const { email } = params;
  
    try {
        // Check if the email exists in the database
        const user: User | null = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Cet email n'existe pas" }, { status: 404 });
        }

        // Get the secret question
        const secretQuestionId = user.secretQuestionId;
        const secretQuestion = await prisma.secretQuestion.findUnique({
            where: {
                id: secretQuestionId,
            },
        });

        return NextResponse.json({ secretQuestion: secretQuestion?.question });

    } catch (error) {
        return NextResponse.json({ message: "Une erreur est survenue" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { email: string } }) {
    const { email } = params;
    const { secretAnswer, newPassword } = await request.json();

    try {
        // Check if the email exists in the database
        const user: User | null = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Cet email n'existe pas" }, { status: 404 });
        }

        // Check if the secret answer is correct
        if (await bcrypt.compare(secretAnswer, user.secretAnswer) === false) {
            return NextResponse.json({ message: "Réponse secrète incorrecte" }, { status: 401 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 15);

        // Update the user's password
        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ message: "Une erreur est survenue" }, { status: 500 });
    }
}