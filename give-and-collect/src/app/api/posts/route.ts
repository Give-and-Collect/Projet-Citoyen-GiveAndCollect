import prisma from '../../../utils/db';
import type { NextApiRequest, NextApiResponse } from 'next';


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
            res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
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
                }
            });
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création de l\'annonce' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


