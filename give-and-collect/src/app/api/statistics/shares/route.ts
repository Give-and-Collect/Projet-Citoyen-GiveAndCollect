import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const shareCount = await prisma.shares.count();
        return NextResponse.json({ count: shareCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération du nombre de partages' }, { status: 500 });
    }
}
