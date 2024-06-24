import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
        return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    try {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0); // dernier jour du mois

        const announcementCount = await prisma.post.count({
            where: {
                creationDate: {
                    gte: startDate,
                    lte: endDate, // inclusif
                },
            },
        });

        return NextResponse.json({ count: announcementCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des annonces' }, { status: 500 });
    }
}