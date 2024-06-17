import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await prisma.event.findMany({
    where: {
      endDate: {
        gte: new Date(),
      },
    }
  });

  if (events.length === 0) {
    return NextResponse.json({ message: "No events found" }, { status: 404 });
  }

  return NextResponse.json(events);
}