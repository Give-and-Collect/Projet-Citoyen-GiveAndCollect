import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function GET() {
    try {
        const secretQuestion = await prisma.secretQuestion.findMany();
        return NextResponse.json(secretQuestion, { status: 200 });
    } catch (error) {
        console.error('Error fetching secret questions:', error);
        return NextResponse.json({ error: 'Error fetching secret questions' }, { status: 500 });
    }
}
