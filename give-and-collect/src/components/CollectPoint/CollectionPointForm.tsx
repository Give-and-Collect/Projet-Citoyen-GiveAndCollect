import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CollectionPoint } from '@/types/collectionPoint';

interface CollectionPointFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (point: CollectionPoint) => void;
}

const CollectionPointForm: React.FC<CollectionPointFormProps> = ({ open, onClose, onSubmit }) => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newPoint = {
            address,
            city,
            postalCode,
            latitude,
            longitude,
            description,
        };

        try {
            const response = await fetch('/api/collection-point', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPoint),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du point de collecte');
            }

            const data = await response.json();
            onSubmit(data); // Appel de la fonction de soumission passée en prop
            onClose(); // Fermer la modal
        } catch (error) {
            console.error('Erreur lors de l\'ajout du point de collecte:', error);
            // Vous pouvez ajouter une gestion d'erreur ici, si nécessaire
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Ajouter un Point de Collecte</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Adresse"
                        fullWidth
                        margin="normal"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <TextField
                        label="Ville"
                        fullWidth
                        margin="normal"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <TextField
                        label="Code Postal"
                        fullWidth
                        margin="normal"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <TextField
                        label="Latitude"
                        fullWidth
                        margin="normal"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                    <TextField
                        label="Longitude"
                        fullWidth
                        margin="normal"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="primary">Annuler</Button>
                        <Button type="submit" color="primary">Ajouter</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CollectionPointForm;
