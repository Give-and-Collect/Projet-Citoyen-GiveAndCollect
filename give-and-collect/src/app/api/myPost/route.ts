import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { getSession } from 'next-auth/react';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const userId = session.user.id;

    try {
        const posts = await prisma.post.findMany({
            where: { authorId: userId },
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
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
    }
}