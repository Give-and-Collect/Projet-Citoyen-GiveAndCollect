import { NextRequest } from 'next/server';
import { POST, GET, defaultHandler } from '@/app/api/collection-point/route';
import prisma from '@/utils/db';

describe('POST /api/collection-point', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('T-API-CollectionPoint-POST-01: Test de la création d\'un point de collecte avec des données valides', async () => {
        const postData = {
            address: '123 Main St',
            city: 'Rouen',
            postalCode: '76000',
            latitude: 45.123,
            longitude: -93.456,
            description: 'Rouen collection point',
        };

        const request = new NextRequest('http://localhost/api/collection-point', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.address).toBe(postData.address);
        expect(json.city).toBe(postData.city);
        expect(json.postalCode).toBe(postData.postalCode);
        expect(json.latitude).toBe(postData.latitude);
        expect(json.longitude).toBe(postData.longitude);
        expect(json.description).toBe(postData.description);
    });

    it('T-API-CollectionPoint-POST-02: Test de la création d\'un point de collecte avec des données manquantes', async () => {
        const postData = {
            address: '123 Main St',
            city: 'Sample City',
            postalCode: '12345',
            latitude: 45.123,
            longitude: -93.456,
            // description field is intentionally missing
        };

        const request = new NextRequest('http://localhost/api/collection-point', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400); // Adjusted expectation to 400 for validation error
        expect(json.error).toBe('Missing required fields'); // Adjusted expectation for validation error message
    });

});

describe('GET /api/collection-point', () => {
    it('T-API-CollectionPoint-GET-01: Test de la récupération de tous les points de collecte actifs', async () => {
        await prisma.collectionPoint.createMany({
            data: [
                {
                    address: '123 Main St',
                    city: 'Rouen',
                    postalCode: '76000',
                    latitude: 45.123,
                    longitude: -93.456,
                    description: 'Rouen collection point',
                    isActive: true,
                },
            ],
        });

        const request = new NextRequest('http://localhost/api/collection-point', {
            method: 'GET',
        });

        const response = await GET(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(json.data)).toBe(true);
        expect(json.data.length).toBeGreaterThan(0);

        const firstCollectionPoint = json.data[0];
        expect(firstCollectionPoint.address).toBeDefined();
        expect(firstCollectionPoint.city).toBeDefined();
        expect(firstCollectionPoint.postalCode).toBeDefined();
        expect(firstCollectionPoint.latitude).toBeDefined();
        expect(firstCollectionPoint.longitude).toBeDefined();
        expect(firstCollectionPoint.description).toBeDefined();
    });
});

describe('T-API-CollectionPoint-DEFAULT-01: Test de la réponse pour une méthode HTTP non autorisée', () => {
    it('should return 405 Method Not Allowed', async () => {
        const request = new NextRequest('http://localhost/api/collection-point', {
            method: 'DELETE',
        });

        const response = await defaultHandler(request);
        const json = await response.json();

        expect(response.status).toBe(405);
        expect(json.error).toBe('Method Not Allowed');
    });
});
