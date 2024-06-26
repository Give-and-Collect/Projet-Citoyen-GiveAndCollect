import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Delete an event
export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const { id } = params;

    const idParsed = parseInt(id.toString());

    // Delete the event
    await prisma.event.delete({
      where: {
        id: idParsed,
      },
    });

    return NextResponse.json({ message: `Event with id ${idParsed} deleted successfully` });
  } catch (error) {
    //console.error(error);
    return NextResponse.json({ message: "Error deleting event" }, { status: 500 });
  }
}
