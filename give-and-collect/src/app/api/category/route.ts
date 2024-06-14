import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Récupérer toutes les annonces
        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: true,
                    postType: true,
                    items: {
                        include: {
                            category: true
                        }
                    }
                }
            });
            res.status(200).json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    } else if (req.method === 'POST') {
        // Créer une nouvelle annonce
        const { address, city, postalCode, latitude, longitude, description, authorId, postTypeId, items } = req.body;
        try {
            const post = await prisma.post.create({
                data: {
                    address,
                    city,
                    postalCode,
                    latitude,
                    longitude,
                    description,
                    creationDate: new Date(),
                    author: { connect: { id: authorId } },
                    postType: { connect: { id: postTypeId } },
                    items: {
                        create: items.map((item: any) => ({
                            size: item.size,
                            quantity: item.quantity,
                            category: { connect: { id: item.categoryId } }
                        }))
                    }
                },
                include: {
                    author: true,
                    postType: true,
                    items: {
                        include: {
                            category: true
                        }
                    }
                }
            });
            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Error creating post' });
        }
    } else {
        // Méthode non autorisée
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
