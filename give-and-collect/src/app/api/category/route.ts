import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
    }
}