import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    try {
        const announcementCount = await prisma.post.count({
            where: {
                creationDate: {
                    gte: new Date(`${year}-${month}-01`),
                    lt: new Date(`${year}-${Number(month) + 1}-01`)
                }
            }
        });

        return NextResponse.json({ count: announcementCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des annonces' }, { status: 500 });
    }
}
