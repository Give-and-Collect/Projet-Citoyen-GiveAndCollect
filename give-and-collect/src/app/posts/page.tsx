"use client";

import React, { useState } from 'react';
import { Button } from '@mui/material';
import PostsModalForm from '../../components/Posts/PostsModalForm';
import { FormData, Ligne } from '../types';

// Initialisation des catégories
const categories = [
    'Chaussures', 'Vestes', 'Robes', 'Pantalons', 'Accessoires',
    'T-Shirt', 'Pull', 'Chemise', 'Jupe', 'Short', 'Manteau',
    'Sous-vêtements', 'Pyjama', 'Costume', 'Maillot de bain',
    'Chaussettes', 'Lingerie', 'Déguisement', 'Autre'
];

const PostAnnonce: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        ville: '',
        type: 'don',
        adresse: '',
        lignes: [{ categorie: '', taille: '', genre: '', quantite: '' }],
    });

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

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
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

    const handlePublish = async () => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                closeModal();
                const newPost = await response.json();
                console.log('Annonce créée :', newPost);
            } else {
                console.error('Erreur lors de la publication de l\'annonce');
            }
        } catch (error) {
            console.error('Erreur lors de la publication de l\'annonce :', error);
        }
    };

    return (
        <div style={{ margin: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="secondary" onClick={openModal}>
                Ajouter une annonce
            </Button>
            <PostsModalForm
                isOpen={modalIsOpen}
                onClose={closeModal}
                formData={formData}
                setFormData={setFormData}  // Ajout de setFormData ici
                categories={categories}
                handleAddLine={handleAddLine}
                handleDeleteLine={handleDeleteLine}
                handleChange={handleChange}
                handlePublish={handlePublish}
            />
        </div>
    );

};

export default PostAnnonce;
