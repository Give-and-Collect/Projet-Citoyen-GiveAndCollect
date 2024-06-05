import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, city, postalCode, latitude, longitude, description } = body;

    const newCollectionPoint = await prisma.collectionPoint.create({
      data: {
        address,
        city,
        postalCode,
        latitude,
        longitude,
        description,
      },
    });

    return NextResponse.json(newCollectionPoint, { status: 200 });
  } catch (error) {
    console.error('Error creating collection point:', error);
    return NextResponse.json({ error: 'Collection point creation failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const collectionPoints = await prisma.collectionPoint.findMany({
      where: {
        isActive: true,
      },
    });
    return NextResponse.json({ data: collectionPoints }, { status: 200 });
  } catch (error) {
    console.error('Error fetching collection points:', error);
    return NextResponse.json({ error: 'Error fetching collection points' }, { status: 500 });
  }
}

// Optionally, handle other methods
export function defaultHandler(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
