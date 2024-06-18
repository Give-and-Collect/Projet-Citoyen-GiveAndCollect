import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { city: string } }) {
    const { city } = params;
  
    try {
      let events;
  
      if (city) {
        events = await prisma.event.findMany({
          where: {
            city: city,
            endDate: {
              gte: new Date(),
            },
          }
        });
      }
  
      if (!events || events.length === 0) {
        events = await prisma.event.findMany(
          {
            where: {
              endDate: {
                gte: new Date(),
              },
            }
          }
        );
      }
  
      if (events.length === 0) {
        return NextResponse.json({ message: "No events found" }, { status: 404 });
      }
  
      return NextResponse.json(events);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}