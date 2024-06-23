import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch all users from the database and return id, firstname, lastname, roleId, posts
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      roleId: true,
    },
  });

  // For each user, count the number of posts and events posted
  const usersWithRolePostEventCounts = await Promise.all(users.map(async (user) => {
    const role = await prisma.role.findUnique({
      where: {
        id: user.roleId,
      },
    });

    const postCount = await prisma.post.count({
      where: {
        authorId: user.id,
      },
    });

    const eventCount = await prisma.event.count({
      where: {
        organizerId: user.id,
      },
    });
    return {
      ...user,
      role: role?.name,
      posts: {
        _count: postCount,
      },
      events: {
        _count: eventCount,
      },
    };
  }));

  return NextResponse.json(usersWithRolePostEventCounts);
}

export async function DELETE({ params }: { params: { id: number } }) {
  const { id } = params;
  
  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return NextResponse.json({ message: `User with id ${id} deleted successfully` });
}