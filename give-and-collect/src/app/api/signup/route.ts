import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {NextRequest, NextResponse} from "next/server";

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
        } = await  req.json();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        try {
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
                return NextResponse.json({ error: 'User creation failed', details: error.message });
            } else {
                return NextResponse.json({ error: 'User creation failed', details: 'An unexpected error occurred' });
            }
        }
}


