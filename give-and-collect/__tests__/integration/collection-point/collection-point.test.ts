import { POST } from '@/app/api/collection-point/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    collectionPoint: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('POST /api/collection-point', () => {
  it('should create a collection point with status 200', async () => {
    const mockCollectionPoint = {
      id: 1,
      address: '123 Test Street',
      city: 'Test City',
      postalCode: '12345',
      latitude: 45.1234,
      longitude: -75.1234,
      description: 'A test collection point',
    };

    (prisma.collectionPoint.create as jest.Mock).mockResolvedValueOnce(mockCollectionPoint);

    const request = new NextRequest('http://localhost/api/collection-point', {
      method: 'POST',
      body: JSON.stringify({
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        latitude: '45.1234',
        longitude: '-75.1234',
        description: 'A test collection point',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(mockCollectionPoint);
  });

  it('should return 500 if there is an error creating the collection point', async () => {
    (prisma.collectionPoint.create as jest.Mock).mockRejectedValueOnce(new Error('Collection point creation failed'));

    const request = new NextRequest('http://localhost/api/collection-point', {
      method: 'POST',
      body: JSON.stringify({
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        latitude: 'invalid-latitude',
        longitude: '-75.1234',
        description: 'A test collection point',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Collection point creation failed');
  });
});
