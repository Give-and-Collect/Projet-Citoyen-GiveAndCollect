import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      roleId: true,
      email: true,
      phone: true,
      nomOrganisation: true,
      profilePicture: true,
      posts: true,
      events: true,
    },
  });

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