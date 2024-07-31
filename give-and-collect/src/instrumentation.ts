import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

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

const roles = ['Admin', 'Particulier', 'Association', 'Entreprise'];

const postTypes = ['Don', 'Collecte'];

const secretQuestions = [
    "Quel est le prénom de votre premier professeur ?",
    "Quel est le nom de votre premier animal de compagnie ?",
    "Quelle est la ville où vous êtes né(e) ?",
    "Quelle est la marque de votre première voiture ?",
    "Quel est le prénom de votre meilleur(e) ami(e) d'enfance ?",
    "Quel est le nom de votre école primaire ?",
    "Quel est le nom de jeune fille de votre mère ?",
    "Quel est le nom de votre film préféré ?",
    "Où avez-vous passé vos vacances d'été préférées ?",
    "Quelle est la première ville que vous avez visitée à l'étranger ?",
    "Quel est votre passe-temps favori ?",
    "Quel était le modèle de votre premier téléphone portable ?",
    "Quel est le nom de la rue où vous avez grandi ?",
    "Quel est le prénom de votre premier(e) collègue de travail ?",
    "Quelle est la couleur de la maison de votre enfance ?"
];

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const existingCategories = await prisma.category.findMany();
        const existingRoles = await prisma.role.findMany();
        const existingPostTypes = await prisma.postType.findMany();
        const existingSecretQuestions = await prisma.secretQuestion.findMany();

        const categoriesToCreate = Object.keys(categories)
            .map(category => ({name: category, type: categories[category]}))
            .filter(({name: key}) => !existingCategories.some(({name}) => name === key));

        const rolesToCreate = roles.filter(role => !existingRoles.some(({name}) => name.toLowerCase() === role.toLowerCase()));
        const postTypesToCreate = postTypes.filter(postType => !existingPostTypes.some(({name}) => name === postType));
        const secretQuestionsToCreate = secretQuestions.filter(question => !existingSecretQuestions.some(({question: existingQuestion}) => existingQuestion === question));

        await prisma.category.createMany({data: categoriesToCreate});
        await prisma.role.createMany({data: rolesToCreate.map(name => ({name}))});
        await prisma.postType.createMany({data: postTypesToCreate.map(name => ({name}))});
        await prisma.secretQuestion.createMany({data: secretQuestionsToCreate.map(question => ({question}))});

        const email = process.env.CYPRESS_EMAIL ?? ''
        const password = process.env.CYPRESS_PASSWORD ?? ''

        const hashedPassword = await bcrypt.hash(password, 15);

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            await prisma.user.create({
                data: {
                    birthDate: new Date(),
                    firstname: 'admin',
                    lastname: 'admin',
                    email,
                    password: hashedPassword,
                    phone: '',
                    nomOrganisation: '',
                    secretAnswer: '',
                    secretQuestionId: 1,
                    roleId: 1,
                }
            });
        }
    }
}