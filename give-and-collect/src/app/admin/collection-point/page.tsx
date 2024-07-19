"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import CollectionPointsCard from '@/components/CollectPoint/CollectionPointsCard';
import CollectionPointForm from '@/components/CollectPoint/CollectionPointForm';
import Loader from '@/components/Loader/Loader';
import Swal from 'sweetalert2';

interface CollectionPoint {
    id: number;
    address: string;
    city: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    description: string;
    isActive: boolean;
}

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
            const result = await Swal.fire({
                title: 'Êtes-vous sûr?',
                text: "Vous ne pourrez pas récupérer ce point de collecte !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer!',
                cancelButtonText: 'Annuler'
            });

            if (result.isConfirmed) {
                const response = await fetch(`/api/collection-point/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Point de collecte supprimé:', data);

                    await Swal.fire({
                        icon: 'success',
                        title: 'Supprimé!',
                        text: 'Le point de collecte a été supprimé.',
                    });

                    fetchCollectionPoints(); // Recharger les points après suppression
                } else {
                    throw new Error('Erreur lors de la suppression du point de collecte.');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du point de collecte:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la suppression du point de collecte.',
            });
        }
    };

    const handleAddPoint = async (newPoint: CollectionPoint) => {
        try {
            // Optionnel : ajouter le point localement avant d'attendre la confirmation du serveur
            setPoints(prevPoints => [newPoint, ...prevPoints]);

            await Swal.fire({
                icon: 'success',
                title: 'Ajouté!',
                text: 'Le point de collecte a été ajouté.',
            });

            fetchCollectionPoints(); // Recharger les points après ajout
            closeModal(); // Fermer la modal après ajout réussi
        } catch (error) {
            console.error('Erreur lors de l\'ajout du point de collecte:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de l\'ajout du point de collecte.',
            });
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
                        <Button variant="contained" color="secondary" onClick={openModal}>
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
