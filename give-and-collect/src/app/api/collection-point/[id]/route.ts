import prisma from '@/utils/db'; // Assurez-vous que ce chemin est correct
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Convertir l'ID en nombre entier
        const idParsed = parseInt(id, 10);

        // Vérifier si l'ID est valide
        if (isNaN(idParsed)) {
            return NextResponse.json({ message: 'ID invalide' }, { status: 400 });
        }

        // Supprimer le point de collecte
        await prisma.collectionPoint.delete({
            where: {
                id: idParsed,
            },
        });

        return NextResponse.json({ message: `Point de collecte avec l'ID ${idParsed} supprimé avec succès` });
    } catch (error) {
        console.error('Erreur lors de la suppression du point de collecte:', error);
        return NextResponse.json({ message: 'Erreur lors de la suppression du point de collecte' }, { status: 500 });
    }
}
