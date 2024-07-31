import { DELETE } from '@/app/api/events/[id]/route';
import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/utils/db', () => ({
  event: {
    delete: jest.fn(),
  },
}));

describe('DELETE /api/events/[id]', () => {
  it('should delete an event and return a success message', async () => {
    const eventId = 1;
    (prisma.event.delete as jest.Mock).mockResolvedValueOnce({});

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: eventId } });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe(`Event with id ${eventId} deleted successfully`);
  });

  it('should return 500 if there is an error deleting the event', async () => {
    const eventId = 1;
    (prisma.event.delete as jest.Mock).mockRejectedValueOnce(new Error('Error deleting event'));

    const request = new NextRequest(`http://localhost/api/events/${eventId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: eventId } });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.message).toBe('Error deleting event');
  });
});
