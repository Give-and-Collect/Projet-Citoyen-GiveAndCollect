import { GET } from '@/app/api/events/city/[city]/route';
import prisma from '@/utils/db';
import { NextRequest } from 'next/server';

jest.mock('@/utils/db', () => ({
  event: {
    findMany: jest.fn(),
  },
}));

describe('GET /api/events/city/[city]', () => {
  it('should return events for a city with status 200', async () => {
    const city = 'Paris';
    const mockedEvents = [
      { id: 1, name: 'Event 1', endDate: new Date(Date.now() + 100000).toISOString() },
      { id: 2, name: 'Event 2', endDate: new Date(Date.now() + 200000).toISOString() },
    ];
    (prisma.event.findMany as jest.Mock).mockResolvedValueOnce(mockedEvents);

    const request = new NextRequest(`http://localhost/api/events/city/${city}`, {
      method: 'GET',
    });

    const response = await GET(request, { params: { city } });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(mockedEvents);
  });

  it('should return all events with status 200 if no events found for the city', async () => {
    const city = 'Paris';
    (prisma.event.findMany as jest.Mock)
      .mockResolvedValueOnce([]) // First call, for city events
      .mockResolvedValueOnce([ // Second call, for fallback events
        { id: 1, name: 'Event 1', endDate: new Date(Date.now() + 100000).toISOString() },
        { id: 2, name: 'Event 2', endDate: new Date(Date.now() + 200000).toISOString() },
      ]);

    const request = new NextRequest(`http://localhost/api/events/city/${city}`, {
      method: 'GET',
    });

    const response = await GET(request, { params: { city } });
    const json = await response.json();

    expect(response.status).toBe(200);
    const expectedEvents = [
      { id: 1, name: 'Event 1', endDate: new Date(Date.now() + 100000).toISOString() },
      { id: 2, name: 'Event 2', endDate: new Date(Date.now() + 200000).toISOString() },
    ];

    // Compare each event individually
    expect(json.length).toBe(expectedEvents.length);
    json.forEach((event, index) => {
      expect(event.id).toBe(expectedEvents[index].id);
      expect(event.name).toBe(expectedEvents[index].name);
      expect(new Date(event.endDate).getTime()).toBeCloseTo(new Date(expectedEvents[index].endDate).getTime(), -2); // Tolerance in milliseconds
    });
  });

  it('should return 404 if no events found at all', async () => {
    const city = 'Paris';
    (prisma.event.findMany as jest.Mock)
      .mockResolvedValueOnce([]) // First call, for city events
      .mockResolvedValueOnce([]); // Second call, for fallback events

    const request = new NextRequest(`http://localhost/api/events/city/${city}`, {
      method: 'GET',
    });

    const response = await GET(request, { params: { city } });
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.message).toBe('No events found');
  });

  it('should return 500 if there is an error fetching events', async () => {
    const city = 'Paris';
    (prisma.event.findMany as jest.Mock).mockRejectedValueOnce(new Error('Error fetching events'));

    const request = new NextRequest(`http://localhost/api/events/city/${city}`, {
      method: 'GET',
    });

    const response = await GET(request, { params: { city } });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.message).toBe('Error fetching events');
  });
});
