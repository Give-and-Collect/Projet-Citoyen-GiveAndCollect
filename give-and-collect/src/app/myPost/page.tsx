"use client";

import { Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import PostsCard from '../../components/Posts/PostsCard';
import { Post } from '../../types/post';

const UserPostsPage = () => {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (session) {
            fetchUserPosts();
        }
    }, [session]);

    const fetchUserPosts = async () => {
        try {
            const response = await fetch('/api/myPost');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des annonces');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
        }
    };

    const handlePostDelete = async (postId: number) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Échec de la suppression de l\'annonce');
            }
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Échec de la suppression de l\'annonce:', error);
        }
    };

    if (status === 'loading') {
        return <Typography variant="body1">Chargement...</Typography>;
    }

    if (!session) {
        return <Typography variant="body1">Connectez-vous pour accéder à cette page.</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom>Vos Annonces</Typography>
            {posts.length > 0 ? (
                <PostsCard posts={posts} session={session} handlePostDelete={handlePostDelete} />
            ) : (
                <Typography variant="body1">Vous n'avez pas encore publié d'annonce.</Typography>
            )}
        </Box>
    );
};

export default UserPostsPage;
