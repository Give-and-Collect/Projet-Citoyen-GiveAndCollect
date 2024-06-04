import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Traitement de la requête POST
    try {
      // Extrayez les données de la requête
      const { address, city, postalCode, latitude, longitude, description } = req.body;

      // Créez un nouveau point de collecte dans la base de données
      const newCollectionPoint = await prisma.collectionPoint.create({
        data: {
          address,
          city,
          postalCode,
          latitude,
          longitude,
          description,
        },
      });

      // Répondre avec les données du point de collecte créé
      return res.status(200).json(newCollectionPoint);
    } catch (error) {
      console.error('Error creating collection point:', error);
      return res.status(500).json({ error: 'Collection point creation failed' });
    }
  } else if (req.method === 'GET') {
    // Traitement de la requête GET
    try {
      // Récupérez tous les points de collecte actifs dans la base de données
      const collectionPoints = await prisma.collectionPoint.findMany({
        where: {
          isActive: true,
        },
      });
      // Répondre avec les données des points de collecte actifs
      return res.status(200).json({ data: collectionPoints });
    } catch (error) {
      console.error('Error fetching collection points:', error);
      return res.status(500).json({ error: 'Error fetching collection points' });
    }
  } else {
    // Gérer les autres types de requêtes ici
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
