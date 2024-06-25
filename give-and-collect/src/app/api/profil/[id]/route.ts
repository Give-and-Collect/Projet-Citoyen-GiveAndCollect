import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/db";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function DELETE(request: NextRequest, { params: { id } }: { params: { id: string } }) {
    const idParsed = parseInt(id, 10);

    try {
        await prisma.user.delete({
            where: { id: idParsed },
        });

        return NextResponse.json({ message: `User with id ${id} deleted successfully` });
    } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    const form = new formidable.IncomingForm();

    form.uploadDir = "./public/uploads"; // Directory to save uploaded files
    form.keepExtensions = true; // Keep file extensions

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return resolve(NextResponse.json({ error: 'Failed to update user' }, { status: 500 }));
            }

            // Extraire les données du formulaire
            const { firstname, lastname, email, phone, nomOrganisation, roleId } = fields;
            const profilePicture = files.profilePicture ? files.profilePicture.path : null;

            const userData = {
                firstname,
                lastname,
                email,
                phone,
                nomOrganisation,
                role: {
                    connect: { id: Number(roleId) },
                },
            };

            // Ajouter l'image de profil si elle existe
            if (profilePicture) {
                userData.profilePicture = profilePicture;
            }

            console.log('Extracted user data:', userData);

            // Mettre à jour l'utilisateur avec le rôle
            try {
                const updatedUser = await prisma.user.update({
                    where: { id: Number(id) },
                    data: userData,
                });

                console.log('User updated successfully:', updatedUser);
                resolve(NextResponse.json(updatedUser));
            } catch (error) {
                console.error('Error updating user:', error);
                resolve(NextResponse.json({ error: 'Failed to update user' }, { status: 500 }));
            }
        });
    });
}



export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    const idParsed = parseInt(id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: { id: idParsed },
            include: {
                role: true,
                posts: true,
                events: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: `User with id ${id} not found` }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
}