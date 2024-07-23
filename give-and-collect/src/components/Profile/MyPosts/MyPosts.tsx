'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import PostsCard from '@/components/Posts/PostsCard';
import { Post } from '@/types/post';
import { Typography } from '@mui/material';
import Loader from '@/components/Loader/Loader';

const MyPosts: React.FC = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchMyPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/posts');
            const data = await response.json();
            if (response.ok) {
                const userPosts = data.filter((post: Post) => post.author.id === session?.user.id);
                setPosts(userPosts);
            } else {
                console.error('Erreur lors de la récupération des annonces:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchMyPosts();
        }
    }, [session, fetchMyPosts]);

    const handlePostDelete = async (id: number, authorId: number) => {
        try {
            const response = await fetch('/api/posts/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authorId }),
            });

            if (response.ok) {
                setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
            } else {
                console.error('Erreur lors de la suppression de l\'annonce');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'annonce:', error);
        }
    };

    if (!session) {
        return <Typography variant="body1">Connectez-vous pour accéder à cette page.</Typography>;
    }

    if (!posts){
        return <Typography variant={"body1"}>Vous n&apos;avez pas encore publier d&apos;annonces </Typography>;
    }
    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <PostsCard posts={posts} session={session} handlePostDelete={handlePostDelete} />
            )}
        </div>
    );
};

export default MyPosts;
