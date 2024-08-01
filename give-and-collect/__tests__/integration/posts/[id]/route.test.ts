import { NextRequest } from 'next/server';
import { DELETE } from '@/app/api/posts/[id]/route';
import prisma from '@/utils/db';

jest.mock('@/utils/db', () => ({
    item: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
    },
    itemCategory: {
        deleteMany: jest.fn(),
    },
    post: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
    },
}));

describe('DELETE /api/posts/:id', () => {
    let postId: number;

    beforeAll(async () => {
        const mockPost = { id: 12345, address: '123 Main St', city: 'Sample City' };
        (prisma.post.create as jest.Mock).mockResolvedValueOnce(mockPost);

        const post = await prisma.post.create({
            data: {
                address: '123 Main St',
                city: 'Sample City',
                postalCode: '12345',
                latitude: 45.123,
                longitude: -93.456,
                description: 'This is a sample post',
                authorId: 1,
                postTypeId: 1,
                creationDate: new Date(),
            },
        });

        postId = post.id;
    });

    afterAll(() => {
        jest.resetAllMocks(); // Reset mocks after tests
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should delete a post and related items and categories', async () => {
        const mockItems = [
            { id: 1 },
            { id: 2 }
        ];

        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: postId });
        (prisma.item.findMany as jest.Mock).mockResolvedValueOnce(mockItems);
        (prisma.itemCategory.deleteMany as jest.Mock).mockResolvedValueOnce({});
        (prisma.item.deleteMany as jest.Mock).mockResolvedValueOnce({});
        (prisma.post.delete as jest.Mock).mockResolvedValueOnce({});

        const request = new NextRequest(`http://localhost/api/posts/${postId}`, {
            method: 'DELETE'
        });

        const response = await DELETE(request, { params: { id: String(postId) } });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual({});

        expect(prisma.post.findUnique).toHaveBeenCalledWith({
            where: { id: postId }
        });
        expect(prisma.item.findMany).toHaveBeenCalledWith({
            where: { postId }
        });
        expect(prisma.itemCategory.deleteMany).toHaveBeenCalledWith({
            where: { itemId: { in: [1, 2] } }
        });
        expect(prisma.item.deleteMany).toHaveBeenCalledWith({
            where: { postId }
        });
        expect(prisma.post.delete).toHaveBeenCalledWith({
            where: { id: postId }
        });
    });

    it('should return an error if the post does not exist', async () => {
        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const request = new NextRequest(`http://localhost/api/posts/${postId}`, {
            method: 'DELETE'
        });

        const response = await DELETE(request, { params: { id: String(postId) } });
        const json = await response.json();

        expect(response.status).toBe(404);
        expect(json).toHaveProperty('error', 'Post not found');

        expect(prisma.post.findUnique).toHaveBeenCalledWith({
            where: { id: postId }
        });
        expect(prisma.item.findMany).not.toHaveBeenCalled();
        expect(prisma.itemCategory.deleteMany).not.toHaveBeenCalled();
        expect(prisma.item.deleteMany).not.toHaveBeenCalled();
        expect(prisma.post.delete).not.toHaveBeenCalled();
    });

    it('should return an error if there is a database issue', async () => {
        (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: postId });
        (prisma.item.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

        const request = new NextRequest(`http://localhost/api/posts/${postId}`, {
            method: 'DELETE'
        });

        const response = await DELETE(request, { params: { id: String(postId) } });
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json).toHaveProperty('error', 'Database error');

        expect(prisma.post.findUnique).toHaveBeenCalledWith({
            where: { id: postId }
        });
        expect(prisma.item.findMany).toHaveBeenCalledWith({
            where: { postId }
        });
        expect(prisma.itemCategory.deleteMany).not.toHaveBeenCalled();
        expect(prisma.item.deleteMany).not.toHaveBeenCalled();
        expect(prisma.post.delete).not.toHaveBeenCalled();
    });
});
