import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Update only the role of a user
export async function PATCH(request: NextRequest, { params }: { params: { id: number }}) {
  const { id } = params;

  const idParsed = parseInt(id.toString());
  
  const body = await request.json();
  const { roleId } = body;

  await prisma.user.update({
    where: { 
      id: idParsed, 
    },
    data: {
      roleId,
    },
  });

  return NextResponse.json({ message: `User with id ${id} updated successfully` });
}
  
// Delete a user
export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
  const { id } = params;

  const idParsed = parseInt(id.toString());

  // User's posts and events have to be deleted before the user
  await prisma.post.deleteMany({
    where: {
      authorId: idParsed,
    },
  });

  await prisma.event.deleteMany({
    where: {
      organizerId: idParsed,
    },
  });

  // Delete the user
  await prisma.user.delete({
    where: {
      id: idParsed,
    },
  });
  
  return NextResponse.json({ message: `User with id ${idParsed} deleted successfully` });
}