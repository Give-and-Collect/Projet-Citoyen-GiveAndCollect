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

// Update user details
export async function PUT(request: NextRequest, { params }: { params: { id: number }}) {
  const { id } = params;
  const idParsed = parseInt(id.toString());

  try {
    const body = await request.json();
    const { firstname, lastname, email, phone, nomOrganisation, profilePicture, roleId } = body;

    const updatedUser = await prisma.user.update({
      where: { id: idParsed },
      data: {
        firstname,
        lastname,
        email,
        phone,
        nomOrganisation,
        profilePicture,
        roleId,
      },
    });

    return NextResponse.json({ message: `User with id ${id} updated successfully`, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}


// GET user by ID
export async function GET(request: NextRequest, { params }: { params: { id: number }}) {
  const { id } = params;
  const idParsed = parseInt(id.toString());

  try {
    const user = await prisma.user.findUnique({
      where: { id: idParsed },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        nomOrganisation: true,
        profilePicture: true,
        roleId: true,
        role: {
          select: {
            name: true,
          }
        },
        posts: {
          select: {
            id: true,
            description: true,
          }
        },
        events: {
          select: {
            id: true,
            description: true,
            startDate: true,
            endDate: true,
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: `User with id ${idParsed} not found` }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
