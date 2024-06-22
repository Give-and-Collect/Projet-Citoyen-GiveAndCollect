import prisma from "@/utils/db";

const categories: Record<string, string> = {
    'Chaussures': 'category',
    'Vestes': 'category',
    'Robes': 'category',
    'Pantalons': 'category',
    'Accessoires': 'category',
    'T-Shirt': 'category',
    'Pull': 'category',
    'Chemise': 'category',
    'Jupe': 'category',
    'Short': 'category',
    'Manteau': 'category',
    'Sous-vêtements': 'category',
    'Pyjama': 'category',
    'Costume': 'category',
    'Maillot de bain': 'category',
    'Chaussettes': 'category',
    'Lingerie': 'category',
    'Déguisement': 'category',
    'Autre': 'category',
    'Homme': 'genre',
    'Femme': 'genre',
    'Fille': 'genre',
    'Garçon': 'genre',
    'Unisexe': 'genre',
}

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const existingCategories = await prisma.category.findMany();

        const categoriesToCreate = Object.keys(categories)
            .map(category => ({name: category, type: categories[category]}))
            .filter(({name: key}) => !existingCategories.some(({name}) => name === key));

        await prisma.category.createMany({data: categoriesToCreate});
    }
}