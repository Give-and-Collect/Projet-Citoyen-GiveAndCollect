"use client";

import React, { useEffect, useState } from 'react';
import {Button, SelectChangeEvent, Container, Typography, Box,} from '@mui/material';
import PostsModalForm from '../../components/Posts/PostsModalForm';
import { FormData, Ligne } from '../../types/post';
import { getSession } from 'next-auth/react';
import { Add } from '@mui/icons-material';
import PostsCard from '../../components/Posts/PostsCard';

// Initialisation des catégories
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
]

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
    const [posts, setPosts] = useState<any[]>([]); // État local pour stocker les annonces récupérées

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        // Fonction pour charger les types de post depuis l'API
        const fetchTypes = async () => {
            try {
                const response = await fetch('/api/types'); // Assurez-vous que l'API correspond bien à votre route GET des types
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des types de post');
                }
                const data = await response.json();
                setTypes(data); // Met à jour l'état local avec les types récupérés depuis l'API
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchTypes(); // Appel de la fonction pour charger les types de post au montage du composant
    }, []);

    useEffect(() => {
        // Fonction pour charger les annonces depuis l'API
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts'); // Assurez-vous que l'API correspond bien à votre route GET des posts
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des annonces');
                }
                const data = await response.json();
                setPosts(data); // Met à jour l'état local avec les annonces récupérées depuis l'API
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchPosts(); // Appel de la fonction pour charger les annonces au montage du composant
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
    const refeshPosts = async () => {
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
    }
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
                refeshPosts(); // Appel de la fonction pour rafraîchir les annonces après la publication
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
