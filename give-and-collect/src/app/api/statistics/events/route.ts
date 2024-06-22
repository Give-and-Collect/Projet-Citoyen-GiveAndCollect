import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    try {
        const eventCount = await prisma.event.count({
            where: {
                startDate: {
                    gte: new Date(`${year}-${month}-01`),
                    lt: new Date(`${year}-${Number(month) + 1}-01`)
                }
            }
        });

        return NextResponse.json({ count: eventCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des événements' }, { status: 500 });
    }
}
