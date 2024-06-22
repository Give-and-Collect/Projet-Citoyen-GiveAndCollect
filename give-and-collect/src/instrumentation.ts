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

const roles = ['Administrateur', 'Particulier', 'Association', 'Entreprise'];

const postTypes = ['Don', 'Collecte'];

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const existingCategories = await prisma.category.findMany();
        const existingRoles = await prisma.role.findMany();
        const existingPostTypes = await prisma.postType.findMany();

        const categoriesToCreate = Object.keys(categories)
            .map(category => ({name: category, type: categories[category]}))
            .filter(({name: key}) => !existingCategories.some(({name}) => name === key));

        const rolesToCreate = roles.filter(role => !existingRoles.some(({name}) => name === role));
        const postTypesToCreate = postTypes.filter(postType => !existingPostTypes.some(({name}) => name === postType));

        await prisma.category.createMany({data: categoriesToCreate});
        await prisma.role.createMany({data: rolesToCreate.map(name => ({name}))});
        await prisma.postType.createMany({data: postTypesToCreate.map(name => ({name}))});
    }
}