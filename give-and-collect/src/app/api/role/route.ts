import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const role = await prisma.role.findMany();
        return NextResponse.json(role, { status: 200 });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ error: 'Error fetching roles' }, { status: 500 });
    }
}
