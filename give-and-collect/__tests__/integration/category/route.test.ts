import { NextRequest } from 'next/server';
import { GET } from '@/app/api/category/route';
import prisma from '@/utils/db';

jest.mock('@/utils/db', () => ({
    category: {
        findMany: jest.fn(),
    },
}));

interface Category {
    id: number;
    name: string;
    type: string;
}

describe('GET /api/category', () => {
    afterAll(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of categories with status 200', async () => {
        const mockCategories: Category[] = [
            { id: 1, name: 'Chaussures', type: 'category' },
            { id: 2, name: 'Femme', type: 'genre' },
        ];
        (prisma.category.findMany as jest.Mock).mockResolvedValueOnce(mockCategories);

        const request = new NextRequest('http://localhost/api/category', {
            method: 'GET'
        });

        const response = await GET(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual(mockCategories);

        expect(prisma.category.findMany).toHaveBeenCalled();
    });

    it('should return an empty list with status 200 if no categories are found', async () => {
        (prisma.category.findMany as jest.Mock).mockResolvedValueOnce([]);

        const request = new NextRequest('http://localhost/api/category', {
            method: 'GET'
        });

        const response = await GET(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual([]);

        expect(prisma.category.findMany).toHaveBeenCalled();
    });

    it('should return an error message with status 500 if there is a database connection error', async () => {
        (prisma.category.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));
    
        const request = new NextRequest('http://localhost/api/category', {
            method: 'GET'
        });
    
        const response = await GET(request);
        const json = await response.json();
    
        expect(response.status).toBe(500);
        expect(json).toEqual({ error: 'Error fetching categories' });
    
        expect(prisma.category.findMany).toHaveBeenCalled();
    });

    it('should verify the structure of returned data', async () => {
        const mockCategories: Category[] = [
            { id: 1, name: 'Chaussures', type: 'category' },
            { id: 2, name: 'Femme', type: 'genre' },
        ];
        (prisma.category.findMany as jest.Mock).mockResolvedValueOnce(mockCategories);

        const request = new NextRequest('http://localhost/api/category', {
            method: 'GET'
        });

        const response = await GET(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(json)).toBe(true);

        // Assert the structure of each category object
        json.forEach((category: Category) => {
            expect(category.id).toBeDefined();
            expect(category.name).toBeDefined();
            expect(category.type).toBeDefined();
        });

        expect(prisma.category.findMany).toHaveBeenCalled();
    });
});
