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
    CardContent,
    useTheme,
    useMediaQuery,
    Paper,
    Avatar
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Send } from '@mui/icons-material';

const About: React.FC = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                setFormData({ name: '', email: '', message: '' });
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
            <Typography variant="h3" align="center" gutterBottom>
                Qui sommes-nous ?
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" paragraph>
                        Nous sommes deux développeurs étudiants de CESI et dans le cadre de notre projet citoyen, nous avons décidé de créer une plateforme permettant de mettre en relation des personnes pour la collecte de vêtements. Notre objectif est de faciliter la communication et la collaboration entre les individus pour une cause commune : aider ceux qui en ont besoin en collectant et redistribuant des vêtements.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            image="../../public/assests/images/banner.jpg"
                            alt="Nous"
                        />
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                Notre projet en images
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Carousel>
                    {['../../public/assests/images/image-1.jpg', '/images/image-2.jpg', '/images/image-3.jpg', '/images/image-4.jpg'].map((image, index) => (
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

            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
                Contactez-nous
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                            <Button variant="contained" color="primary" type="submit" endIcon={<Send />}>
                                Envoyer
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default About;
