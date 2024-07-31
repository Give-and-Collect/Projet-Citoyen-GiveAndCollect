import { GET, POST } from '@/app/api/events/route';
import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/utils/db', () => ({
  event: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

// Get all events
describe('GET /api/events', () => {
  it('should return events with status 200', async () => {
    const mockedEvents = [
      { id: 1, name: 'Event 1', endDate: new Date(Date.now() + 100000).toISOString() },
      { id: 2, name: 'Event 2', endDate: new Date(Date.now() + 200000).toISOString() },
    ];
    (prisma.event.findMany as jest.Mock).mockResolvedValueOnce(mockedEvents);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(mockedEvents);
  });

  it('should return 404 if no events found', async () => {
    (prisma.event.findMany as jest.Mock).mockResolvedValueOnce([]);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.message).toBe('No events found');
  });
});

// Post a new event
describe('POST /api/events', () => {
  it('should create a new event and return it with status 201', async () => {
    const newEvent = {
      id: 1,
      title: 'New Event',
      description: 'Event description',
      address: '123 Street',
      city: 'City',
      postalCode: '12345',
      latitude: 0,
      longitude: 0,
      startDate: new Date(Date.now() + 100000).toISOString(),
      endDate: new Date(Date.now() + 200000).toISOString(),
      phone: '123-456-7890',
      creationDate: new Date().toISOString(),
      organizerId: 1,
    };
    (prisma.event.create as jest.Mock).mockResolvedValueOnce(newEvent);

    const request = new NextRequest('http://localhost/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Event',
        description: 'Event description',
        address: '123 Street',
        city: 'City',
        postalCode: '12345',
        latitude: 0,
        longitude: 0,
        startDate: new Date(Date.now() + 100000),
        endDate: new Date(Date.now() + 200000),
        phone: '123-456-7890',
        organizerId: 1,
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual(newEvent);
  });

  it('should return 500 if there is an error creating the event', async () => {
    (prisma.event.create as jest.Mock).mockRejectedValueOnce(new Error('Error creating event'));

    const request = new NextRequest('http://localhost/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Event',
        description: 'Event description',
        address: '123 Street',
        city: 'City',
        postalCode: '12345',
        latitude: 0,
        longitude: 0,
        startDate: new Date(Date.now() + 100000),
        endDate: new Date(Date.now() + 200000),
        phone: '123-456-7890',
        organizerId: 1,
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.message).toBe('Error creating event');
  });
});
