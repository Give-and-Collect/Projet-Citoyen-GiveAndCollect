import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/authOptions'; // Assurez-vous que le chemin est correct

export async function GET(req: NextRequest) {
    try {
        // Récupérer la session de l'utilisateur
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Utilisateur non connecté' }, { status: 401 });
        }

        // Extraire l'ID de l'utilisateur de la session
        const userId = session.user.id;

        // Récupérer les annonces filtrées par l'ID de l'utilisateur
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId
            },
            include: {
                author: {
                    include: {
                        role: true
                    }
                },
                postType: true,
                items: {
                    include: {
                        ItemCategory: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                creationDate: 'desc'
            }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des annonces' }, { status: 500 });
    }
}

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