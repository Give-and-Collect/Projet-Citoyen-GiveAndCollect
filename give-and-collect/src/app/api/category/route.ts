import prisma from '../../../utils/db';
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({error: 'Error fetching categories'}, {status: 500})
    }
}