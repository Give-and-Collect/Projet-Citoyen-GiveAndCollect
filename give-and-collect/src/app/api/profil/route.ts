import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.method === 'GET') {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
        });
        return res.json(user);
    }

    if (req.method === 'PUT') {
        const updates = req.body;

        const user = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: updates,
        });

        return res.json(user);
    }

    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
