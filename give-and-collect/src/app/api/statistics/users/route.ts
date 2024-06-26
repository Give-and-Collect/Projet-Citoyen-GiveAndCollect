import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const userCount = await prisma.user.count();
        return NextResponse.json({ count: userCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération du nombre d\'utilisateurs' }, { status: 500 });
    }
}
