import { GET, POST } from '@/app/api/posts/route';
import prisma from '@/utils/db';
import { NextRequest } from 'next/server';

jest.mock('@/utils/db', () => ({
    __esModule: true,
    default: {
        $disconnect: jest.fn(),
        post: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
        category: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        item: {
            create: jest.fn(),
        },
        itemCategory: {
            create: jest.fn(),
        },
    },
}));

describe('Posts API', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/posts', () => {
        it('should create a new post with valid data, including creating new categories if they do not exist', async () => {
            const categories: Record<string, string> = {
                'Pantalons': 'category',
                'Homme': 'genre',
            };

            // Mocks de Prisma pour retourner des valeurs de catégorie existantes ou créer si nécessaire
            const createCategoryMock = jest.spyOn(prisma.category, 'create');
            (prisma.category.findFirst as jest.Mock).mockImplementation(async (params) => {
                const categoryName = params.where.name;
                if (categories[categoryName]) {
                    return { id: 1, name: categoryName }; // Simuler la catégorie existante
                }
                return null; // Simuler que la catégorie n'existe pas
            });

            (prisma.post.create as jest.Mock).mockResolvedValueOnce({ id: 1, address: '66 rue du pasteur', city: 'rouen' });
            (prisma.item.create as jest.Mock).mockResolvedValueOnce({ id: 1 });
            (prisma.itemCategory.create as jest.Mock).mockResolvedValueOnce({});

            // Requête avec des données valides, incluant des catégories potentiellement non existantes
            const request = new NextRequest('http://localhost/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    address: '66 rue du pasteur',
                    city: 'rouen',
                    postalCode: '76000',
                    latitude: 45.123,
                    longitude: -93.456,
                    description: 'This is a sample post',
                    authorId: 1,
                    postTypeId: 1,
                    items: [
                        { size: '42', quantity: 5, categories: ['Pantalons', 'Homme'] }
                    ]
                }),
            });

            const response = await POST(request);
            const json = await response.json();

            // Vérification des résultats attendus
            expect(response.status).toBe(200);
            expect(json).toHaveProperty('address', '66 rue du pasteur');
            expect(json).toHaveProperty('city', 'rouen');

            expect(createCategoryMock).toHaveBeenCalledTimes(0);

        });

        it('should return 500 error when missing required data', async () => {
            const request = new NextRequest('http://localhost/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    address: '123 Main St',
                    city: 'Sample City',
                    postalCode: '12345',
                    latitude: 45.123,
                    longitude: -93.456,
                    // missing description
                    authorId: '1',
                    postTypeId: '1',
                    items: [
                        { size: 'medium', quantity: 5, categories: ['Pantalons', 'Manteau'] }
                    ]
                }),
            });

            const response = await POST(request);
            const json = await response.json();

            expect(response.status).toBe(500);
            expect(json).toHaveProperty('error', "Erreur lors de la création de l'annonce");
        });

        it('should create new categories if they do not exist', async () => {
            (prisma.category.findFirst as jest.Mock).mockResolvedValueOnce(null);
            (prisma.category.create as jest.Mock).mockResolvedValueOnce({ id: 1, name: 'nonexistent-category1' });
            (prisma.category.findFirst as jest.Mock).mockResolvedValueOnce(null);
            (prisma.category.create as jest.Mock).mockResolvedValueOnce({ id: 2, name: 'nonexistent-category2' });
            (prisma.post.create as jest.Mock).mockResolvedValueOnce({ id: 1, address: '123 Main St', city: 'Sample City' });
            (prisma.item.create as jest.Mock).mockResolvedValueOnce({ id: 1 });
            (prisma.itemCategory.create as jest.Mock).mockResolvedValueOnce({});

            const request = new NextRequest('http://localhost/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    address: '123 Main St',
                    city: 'Sample City',
                    postalCode: '12345',
                    latitude: 45.123,
                    longitude: -93.456,
                    description: 'This is a sample post',
                    authorId: 'valid-author-id',
                    postTypeId: 'valid-post-type-id',
                    items: [
                        { size: 'medium', quantity: 5, categories: ['nonexistent-category1', 'nonexistent-category2'] }
                    ]
                }),
            });

            const response = await POST(request);
            const json = await response.json();

            expect(response.status).toBe(200);
            expect(json).toHaveProperty('address', '123 Main St');
        });
    });

    describe('GET /api/posts', () => {
        it('should retrieve all posts', async () => {
            const mockedPosts = [
                {
                    id: 1, address: '123 Main St', city: 'Sample City', postalCode: '12345', latitude: 45.123, longitude: -93.456, description: 'Sample description', creationDate: new Date().toISOString(), author: { id: 'valid-author-id', role: { name: 'Admin' } }, postType: { id: 'valid-post-type-id', name: 'Type1' }, items: []
                }
            ];
            (prisma.post.findMany as jest.Mock).mockResolvedValueOnce(mockedPosts);

            const request = new NextRequest('http://localhost/api/posts', {
                method: 'GET'
            });

            const response = await GET(request);
            const json = await response.json();

            expect(response.status).toBe(200);
            expect(Array.isArray(json)).toBe(true);
            expect(json).toEqual(mockedPosts);
        });

        it('should return 500 error if database retrieval fails', async () => {
            (prisma.post.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

            const request = new NextRequest('http://localhost/api/posts', {
                method: 'GET'
            });

            const response = await GET(request);
            const json = await response.json();

            expect(response.status).toBe(500);
            expect(json).toHaveProperty('error', 'Erreur lors de la récupération des annonces');
        });
    });
});
