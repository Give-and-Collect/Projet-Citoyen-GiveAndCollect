import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function DELETE({ params }: { params: { id: number } }) {
    const { id } = params;
  
    return NextResponse.json({ message: `User with id ${id} deleted successfully` });
  }