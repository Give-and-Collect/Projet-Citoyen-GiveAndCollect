import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function POST(req: NextRequest) {
    try {
        const {
            birthDate,
            firstname,
            lastname,
            email,
            password,
            phone,
            nomOrganisation,
            secretAnswer,
            secretQuestionId,
            roleId,
        } = await req.json();

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
            }
            if (existingUser.phone === phone) {
                return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const hashedSecretAnswer = await bcrypt.hash(secretAnswer, 15);

        const newUser = await prisma.user.create({
            data: {
                birthDate: new Date(birthDate),
                firstname,
                lastname,
                email,
                password: hashedPassword,
                phone,
                nomOrganisation,
                secretAnswer: hashedSecretAnswer,
                secretQuestionId: secretQuestionId,
                roleId,
            }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('User creation failed:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'User creation failed', details: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
    }
}
