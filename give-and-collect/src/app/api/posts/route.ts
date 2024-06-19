import prisma from '../../../utils/db';
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    // Créer une nouvelle annonce
    const {address, city, postalCode, latitude, longitude, description, authorId, postTypeId, items} = await req.json();

    try {
        const categories: Set<string> = new Set(items.flatMap((item: any) => item.categories));
        console.log('categories ', categories);
        const categoryNameById: Record<string, number> = {};

        for (let category of categories) {
            let savedCategory = await prisma.category.findFirst({
                where: {name: category}
            })
            if (!savedCategory) {
                savedCategory = await prisma.category.create({
                    data: {name: category, type: ''}
                });
            }

            categoryNameById[category] = savedCategory.id;
        }

        const post = await prisma.post.create({
            data: {
                address,
                city,
                postalCode,
                latitude,
                longitude,
                description,
                creationDate: new Date(),
                author: {connect: {id: authorId}},
                postType: {connect: {id: postTypeId}},
            }
        });

        for (let item of items) {
            const savedItem = await prisma.item.create({
                data: {
                    size: item.size,
                    quantity: item.quantity,
                    post: {connect: {id: post.id}}
                }
            });

            for (let category of item.categories) {
                await prisma.itemCategory.create({
                    data: {
                        item: {connect: {id: savedItem.id}},
                        category: {connect: {id: categoryNameById[category]}}
                    }
                });
            }
        }

        return NextResponse.json(post);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Erreur lors de la création de l\'annonce'}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true,
                postType: true,
                items: {
                    include: {
                        categories: true
                    }
                }
            }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des annonces' }, { status: 500 });
    }
}