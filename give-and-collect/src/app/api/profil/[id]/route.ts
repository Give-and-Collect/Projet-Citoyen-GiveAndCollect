import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/db";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    const { id } = params;

    const idParsed = parseInt(id.toString());

    const posts = await prisma.post.findMany({
        where: {
            authorId: idParsed,
        },
    });

    console.log('posts to delete', posts)

    for(const post of posts) {
        const items = await prisma.item.findMany({
            where: {postId: Number(post.id)}
        });
        await prisma.itemCategory.deleteMany({
            where: {itemId: {in: items.map(item => item.id)}}
        });

        await prisma.item.deleteMany({
            where: {postId: Number(post.id)}
        });

        await prisma.post.delete({
            where: {id: Number(post.id)}
        });
    }

    console.log('posts successfully deleted')

    await prisma.event.deleteMany({
        where: {
            organizerId: idParsed,
        },
    });

    // Delete the user
    await prisma.user.delete({
        where: {
            id: idParsed,
        },
    });

    return NextResponse.json({ message: `User with id ${idParsed} deleted successfully` });
}

export async function PUT(req: NextRequest, {params: {id}}: { params: { id: string } }) {
    const {
        firstname,
        lastname,
        email,
        phone,
        nomOrganisation,
        profilePicture
    } = await req.json();

    const userData = {
        firstname,
        lastname,
        email,
        phone,
        nomOrganisation
    };

    console.log('Extracted user data:', userData);

    // Mettre à jour l'utilisateur avec le rôle
    try {
        const updatedUser = await prisma.user.update({
            where: {id: Number(id)},
            data: userData,
        });

        console.log('User updated successfully:', updatedUser);
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({error: 'Failed to update user'}, {status: 500});
    }
}


export async function GET(req: NextRequest, {params: {id}}: { params: { id: string } }) {
    const idParsed = parseInt(id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: {id: idParsed},
            include: {
                role: true,
                posts: true,
                events: true,
            },
        });

        if (!user) {
            return NextResponse.json({error: `User with id ${id} not found`}, {status: 404});
        }

        return NextResponse.json({user});
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({error: 'Failed to fetch user details'}, {status: 500});
    }
}