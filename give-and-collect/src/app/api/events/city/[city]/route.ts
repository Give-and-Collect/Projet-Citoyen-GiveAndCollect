import prisma from "@/utils/db";
import { Event } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { city: string } }) {
  const { city } = params;

  try {
    let events: Event[] = [];

    // Fetch events for the specified city
    if (city) {
      events = await prisma.event.findMany({
        where: {
          city: city,
          endDate: {
            gte: new Date(),
          },
        },
      });
    }

    // If no events found for the specified city, fetch all upcoming events
    if (!events || events.length === 0) {
      events = await prisma.event.findMany({
        where: {
          endDate: {
            gte: new Date(),
          },
        },
      });
    }

    // If no events found at all, return 404
    if (!events || events.length === 0) {
      return NextResponse.json({ message: "No events found" }, { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    //console.error("Error fetching events: ", error);
    return NextResponse.json({ message: "Error fetching events" }, { status: 500 });
  }
}
