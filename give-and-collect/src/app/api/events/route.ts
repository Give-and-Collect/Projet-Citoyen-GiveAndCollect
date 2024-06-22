import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const { title, description, address, city, postalCode, latitude, longitude, startDate, endDate, phone, organizerId } = await req.json();
  const creationDate = new Date();

  const newEvent = await prisma.event.create({
    data: {
      title,
      description,
      address,
      city,
      postalCode,
      latitude,
      longitude,
      startDate,
      endDate,
      phone,
      creationDate,
      organizerId,
    },
  });

  return NextResponse.json(newEvent, { status: 201 });
}