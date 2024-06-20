"use client";

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    TextField,
    Card,
    CardMedia,
    Paper,
    styled
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Send } from '@mui/icons-material';

interface FormValues {
    name: string;
    email: string;
    message: string;
}

const initValues: FormValues = {
    name: '',
    email: '',
    message: '',
};

// Exemple de style inline avec sx
const PaperStyled = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    '& .MuiTextField-root': {
        marginBottom: theme.spacing(2),
    },
    '& .MuiButton-root': {
        marginTop: theme.spacing(2),
    },
}));

export default function Contact() {
    const [formData, setFormData] = useState<FormValues>(initValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Message envoyé avec succès !');
                setFormData(initValues);
            } else {
                alert("Erreur lors de l'envoi du message.");
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors de l'envoi du message.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* À propos de nous */}
            <Typography variant="h3" align="center" gutterBottom>
                À propos de nous
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6}>
                    <PaperStyled elevation={3}>
                        <Typography variant="body1">
                            Nous sommes deux développeurs étudiants de CESI et dans le cadre de notre projet citoyen, nous avons décidé de créer une plateforme permettant de mettre en relation des personnes pour la collecte de vêtements. Notre objectif est de faciliter la communication et la collaboration entre les individus pour une cause commune : aider ceux qui en ont besoin en collectant et redistribuant des vêtements.
                        </Typography>
                    </PaperStyled>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="auto"
                            image="/assets/images/image-4.jpg"
                            alt="Nous"
                        />
                    </Card>
                </Grid>
            </Grid>

            {/* Carrousel d'images */}
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                Notre projet en images
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Carousel>
                    {['/assets/images/image-1.jpg', '/assets/images/image-2.jpg', '/assets/images/image-3.jpg', '/assets/images/image-4.jpg'].map((image, index) => (
                        <Card key={index}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={image}
                                alt={`Image ${index + 1}`}
                            />
                        </Card>
                    ))}
                </Carousel>
            </Paper>

            {/* Contactez-nous */}
            <Typography variant="h3" align="center" gutterBottom>
                Contactez-nous
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6}>
                    <PaperStyled elevation={3}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nom"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Message"
                                        name="message"
                                        multiline
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        endIcon={<Send />}
                                    >
                                        Envoyer
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </PaperStyled>
                </Grid>
            </Grid>
        </Container>
    );
}
