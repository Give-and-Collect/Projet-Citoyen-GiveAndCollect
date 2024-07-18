import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const items = await prisma.item.findMany({
            where: { postId: Number(id) }
        });

        if (items.length > 0) {
            await prisma.itemCategory.deleteMany({
                where: { itemId: { in: items.map(item => item.id) } }
            });

            await prisma.item.deleteMany({
                where: { postId: Number(id) }
            });
        }

        await prisma.post.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
