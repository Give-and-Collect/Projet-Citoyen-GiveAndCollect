import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/db";

export async function DELETE(req: NextRequest, {params: {id}}: { params: { id: string } }) {
    const items = await prisma.item.findMany({
        where: {postId: Number(id)}
    });

    await prisma.itemCategory.deleteMany({
        where: {itemId: {in: items.map(item => item.id)}}
    });

    await prisma.item.deleteMany({
        where: {postId: Number(id)}
    });

    await prisma.post.delete({
        where: {id: Number(id)}
    });

    return NextResponse.json({})
}