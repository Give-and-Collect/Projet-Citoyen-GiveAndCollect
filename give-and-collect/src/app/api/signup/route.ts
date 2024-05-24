import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    console.log('req.method', req.method);
    const {
        birthDate,
        firstname,
        lastname,
        email,
        password,
        phone,
        address,
        city,
        postalCode,
        nomOrganisation,
    } = await req.json();

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 15);

        const newUser = await prisma.user.create({
            data: {
                birthDate: new Date(birthDate),
                firstname,
                lastname,
                email,
                password: hashedPassword,
                phone,
                address,
                city,
                postalCode,
                nomOrganisation,
            },
        });
        return NextResponse.json(newUser);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'User creation failed', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'User creation failed', details: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json({ data: users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }
}

