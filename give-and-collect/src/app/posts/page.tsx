"use client";

import React, {useEffect, useState} from 'react';
import {Button, SelectChangeEvent} from '@mui/material';
import PostsModalForm from '../../components/Posts/PostsModalForm';
import { FormData, Ligne } from '../../types/post';
import {getSession} from "next-auth/react";

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
        lignes: [{categorie: '', taille: '', genre: '', quantite: ''}],
    });

    const [types, setTypes] = useState<{ id: number, name: string }[]>([]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        fetch('/api/types')
            .then(response => response.json())
            .then(setTypes)
    }, []);

    const handleAddLine = () => {
        setFormData(prevState => ({
            ...prevState,
            lignes: [
                ...prevState.lignes,
                {categorie: '', taille: '', genre: '', quantite: ''},
            ],
        }));
    };

    const handleDeleteLine = (index: number) => {
        setFormData(prevState => {
            const newLines = [...prevState.lignes];
            newLines.splice(index, 1);
            return {...prevState, lignes: newLines};
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
        index: number,
        field: keyof Ligne,
    ) => {
        const {value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            lignes: prevState.lignes.map((line, i) =>
                i === index ? {...line, [field]: value} : line
            )
        }));
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
                console.log('Annonce créée :', newPost);
            } else {
                console.error('Erreur lors de la publication de l\'annonce');
            }
        } catch (error) {
            console.error('Erreur lors de la publication de l\'annonce :', error);
        }
    };

    return (
        <div style={{margin: '20px', display: 'flex', justifyContent: 'flex-end'}}>
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
                types={types}
                genres={genres}
            />
        </div>
    );

};

export default PostAnnonce;
