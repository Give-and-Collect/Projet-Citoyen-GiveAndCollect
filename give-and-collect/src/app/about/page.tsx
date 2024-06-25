"use client";
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Button,
    TextField,
    Card,
    CardMedia,
    Paper,
    IconButton,
    InputAdornment,
    styled
} from '@mui/material';
import { Send, Email, Person, Subject } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';

interface FormValues {
    name: string;
    email: string;
    message: string;
    subject: string;
}

const initValues: FormValues = {
    name: '',
    email: '',
    message: '',
    subject: '',
};

const HeaderSection = styled('header')(({ theme }) => ({
    position: 'relative',
    height: '70vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.palette.common.white,
    overflow: 'hidden',
}));

const BackgroundImage = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    backgroundImage: `url('/assets/images/image-2.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(10px) brightness(0.6)'
}));

const ContentWrapper = styled('div')({
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
});

const CustomCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    '& .MuiCardMedia-root': {
        height: 'auto',
        maxWidth: '100%',
    },
}));

const Contact = () => {
    const [formData, setFormData] = useState<FormValues>(initValues);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: sanitizeInput(value),
        }));
    };

    const sanitizeInput = (input: string): string => {
        return input.replace(/['"<>]/g, '');
    };

    const containsMaliciousPatterns = (input: string): boolean => {
        const patterns = [
            /<script.*?>.*?<\/script.*?>/i,
            /<.*?onerror=.*?>/i,
            /' OR '1'='1/i,
            /;.*--/i,
            /http:\/\/|https:\/\//i,
            /[!@#$%^&*()_+]/i,
            /&#x3C;.*?&#x3E;/i
        ];
        return patterns.some(pattern => pattern.test(input));
    };

    const validateForm = (): boolean => {
        if ([formData.name, formData.subject, formData.message, formData.email].some(input => containsMaliciousPatterns(input))) {
            setErrorMessage('Votre message contient des caractères non autorisés. Veuillez éviter les symboles spéciaux (comme ! @ # $ % ^ & * ( ) _ +), les scripts, les liens URL ou d\'autres éléments potentiellement dangereux.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

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
        <div>
            {/* Header avec image et texte */}
            <HeaderSection>
                <BackgroundImage />
                <ContentWrapper>
                    <Typography variant="h4" component="h1" sx={{ textAlign: 'center', maxWidth: '100%', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                        Nous sommes deux développeurs étudiants de CESI et dans le cadre de notre projet citoyen, nous avons décidé de créer une plateforme permettant de mettre en relation des personnes pour la collecte de vêtements. Notre objectif est de faciliter la communication et la collaboration entre les individus pour une cause commune : aider ceux qui en ont besoin en collectant et redistribuant des vêtements.
                    </Typography>
                </ContentWrapper>
            </HeaderSection>

            {/* Carrousel d'images */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Notre projet en images
                </Typography>
                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <Carousel
                        autoPlay={false}
                        animation="slide"
                        indicators={true}
                        navButtonsAlwaysVisible={true}
                    >
                        {['/assets/images/image-1.jpg', '/assets/images/image-2.jpg', '/assets/images/image-3.jpg', '/assets/images/image-4.jpg'].map((image, index) => (
                            <CustomCard key={index}>
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt={`Image ${index + 1}`}
                                />
                            </CustomCard>
                        ))}
                    </Carousel>
                </Paper>
            </Container>

            {/* Contactez-nous */}
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Contactez-nous
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nom / Prénom "
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconButton color="primary">
                                                            <Person />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconButton color="primary">
                                                            <Email />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Objet"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconButton color="primary">
                                                            <Subject />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                    {errorMessage && (
                                        <Grid item xs={12}>
                                            <Typography color="error">{errorMessage}</Typography>
                                        </Grid>
                                    )}
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
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Contact;
