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
export async function DELETE({ params }: { params: { id: number } }) {
  const { id } = params;
  
  return NextResponse.json({ message: `User with id ${id} deleted successfully` });
}