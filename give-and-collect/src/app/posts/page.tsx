"use client";

import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, SelectChangeEvent } from '@mui/material'; // Assurez-vous d'importer SelectChangeEvent
import PostsModalForm from '../../components/Posts/PostsModalForm';
import { FormData, Ligne } from '../../types/post';
import { getSession } from 'next-auth/react';
import { Add } from '@mui/icons-material';
import PostsCard from '../../components/Posts/PostsCard';

const categories = [
    'Chaussures', 'Vestes', 'Robes', 'Pantalons', 'Accessoires',
    'T-Shirt', 'Pull', 'Chemise', 'Jupe', 'Short', 'Manteau',
    'Sous-vêtements', 'Pyjama', 'Costume', 'Maillot de bain',
    'Chaussettes', 'Lingerie', 'Déguisement', 'Autre'
];

const genres = [
    'Homme',
    'Femme',
    'Fille',
    'Garçon',
    'Unisexe'
];

const PostAnnonce: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        city: '',
        type: 'don',
        address: '',
        postalCode: '',
        description: '',
        lignes: [{ categorie: '', taille: '', genre: '', quantite: '' }],
    });

    const [types, setTypes] = useState<{ id: number, name: string }[]>([]);
    const [posts, setPosts] = useState<any[]>([]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch('/api/types');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des types de post');
                }
                const data = await response.json();
                setTypes(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchTypes();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des annonces');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleAddLine = () => {
        setFormData(prevState => ({
            ...prevState,
            lignes: [
                ...prevState.lignes,
                { categorie: '', taille: '', genre: '', quantite: '' },
            ],
        }));
    };

    const handleDeleteLine = (index: number) => {
        setFormData(prevState => {
            const newLines = [...prevState.lignes];
            newLines.splice(index, 1);
            return { ...prevState, lignes: newLines };
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
        index: number,
        field: keyof Ligne,
    ) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            lignes: prevState.lignes.map((line, i) =>
                i === index ? { ...line, [field]: value } : line
            )
        }));
    };

    const refreshPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des annonces');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handlePublish = async () => {
        try {
            const session = await getSession();

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    city: formData.city,
                    type: formData.type,
                    address: formData.address,
                    postalCode: formData.postalCode,
                    latitude: 1.0,
                    longitude: 1.0,
                    description: formData.description,
                    authorId: session?.user.id,
                    postTypeId: Number(formData.type),
                    items: formData.lignes.map(line => ({
                        size: line.taille,
                        quantity: Number(line.quantite),
                        categories: [line.categorie, line.genre]
                    }))
                }),
            });
            if (response.ok) {
                closeModal();
                const newPost = await response.json();
                alert('Annonce créée avec succès !');
                refreshPosts();
                console.log('Annonce créée :', newPost);
            } else {
                console.error('Erreur lors de la publication de l\'annonce');
            }
        } catch (error) {
            console.error('Erreur lors de la publication de l\'annonce :', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="secondary" onClick={openModal} startIcon={<Add />}>
                    Ajouter une annonce
                </Button>
            </Box>
            <Typography variant="h4" align="center" gutterBottom>
                Listes des Annonces
            </Typography>
            <PostsModalForm
                isOpen={modalIsOpen}
                onClose={closeModal}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                handleAddLine={handleAddLine}
                handleDeleteLine={handleDeleteLine}
                handleChange={handleChange}
                handlePublish={handlePublish}
                types={types}
                genres={genres}
            />
            <Box mt={3}>
                <PostsCard posts={posts} />
            </Box>
        </Container>
    );

};

export default PostAnnonce;
