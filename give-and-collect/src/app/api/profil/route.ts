import { getSession } from 'next-auth/react';
import { NextApiResponse, NextApiRequest } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
        console.log("No session found");
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = session.user.id; // Assurez-vous que session.user.id est défini
    console.log("Session found:", session);

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            console.log("User data fetched:", user);
            return res.json(user);
        } catch (error) {
            console.error("Error fetching user data:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const updates = req.body;

            const user = await prisma.user.update({
                where: { id: userId },
                data: updates,
            });
            console.log("User data updated:", user);
            return res.json(user);
        } catch (error) {
            console.error("Error updating user data:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
