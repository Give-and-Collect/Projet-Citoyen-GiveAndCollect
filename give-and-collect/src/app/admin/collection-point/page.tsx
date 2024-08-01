"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import CollectionPointsCard from '@/components/CollectPoint/CollectionPointsCard';
import CollectionPointForm from '@/components/CollectPoint/CollectionPointForm';
import Loader from '@/components/Loader/Loader';
import { CollectionPoint } from '@/types/collectionPoint'; // Importer le type

const CollectionPointsPage: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [points, setPoints] = useState<CollectionPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const fetchCollectionPoints = async () => {
        try {
            const response = await fetch('/api/collection-point');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.data) {
                setPoints(data.data);
            } else {
                throw new Error('Data format error');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des points de collecte:', error);
            setError('Erreur lors de la récupération des points de collecte.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCollectionPoints();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const userConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce point de collecte ?");
            if (userConfirmed) {
                const response = await fetch(`/api/collection-point/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    console.log('Point de collecte supprimé:', await response.json());
                    fetchCollectionPoints(); // Recharger les points après suppression
                } else {
                    console.error('Erreur lors de la suppression du point de collecte.');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du point de collecte:', error);
        }
    };

    const handleAddPoint = async (newPoint: CollectionPoint) => {
        try {
            setPoints(prevPoints => [newPoint, ...prevPoints]);
            console.log('Point de collecte ajouté:', newPoint);

            fetchCollectionPoints(); // Recharger les points après ajout
            closeModal(); // Fermer la modal après ajout réussi
        } catch (error) {
            console.error('Erreur lors de l\'ajout du point de collecte:', error);
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Typography
                        color="primary"
                        textAlign="center"
                        textTransform="uppercase"
                        fontWeight={'bold'}
                        fontSize={32}
                        mt={5}
                        mb={3}
                    >
                        Points de Collecte
                    </Typography>

                    {error && (
                        <Typography color="error.main" textAlign="center" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={openModal}
                            data-testid="add-button"
                        >
                            Ajouter un point de collecte
                        </Button>
                    </Box>

                    <CollectionPointForm open={modalIsOpen} onClose={closeModal} onSubmit={handleAddPoint} />

                    <CollectionPointsCard points={points} onDelete={handleDelete} />
                </Container>
            )}
        </>
    );
};

export default CollectionPointsPage;
