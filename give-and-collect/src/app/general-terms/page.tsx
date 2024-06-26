import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const GeneralTerms = () => {
    return (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        Conditions générales d&apos;utilisation
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontStyle: 'italic', color: 'text.secondary', marginBottom: 2, textAlign: 'center' }}>
                        En vigueur au 24/06/2024
                    </Typography>

                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Les présentes conditions générales d&apos;utilisation (ci-après les &quot;CGU&quot;) ont pour objet l&apos;encadrement juridique des modalités de mise à disposition du site et des services par Give&Collect et de définir les conditions d&apos;accès et d&apos;utilisation des services par l&apos;utilisateur (ci-après &quot;l&apos;Utilisateur&quot;).
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 1 - ACCES AU SITE
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Le site Give&Collect permet à l&apos;Utilisateur un accès gratuit aux services suivants :
                    </Typography>
                    <Box component="div" sx={{ marginLeft: 2, marginBottom: 2 }}>
                        <Typography component="div" paragraph>- Consultation des annonces</Typography>
                        <Typography component="div" paragraph>- Publication d&apos;annonces</Typography>
                        <Typography component="div" paragraph>- Participation à des événements</Typography>
                    </Box>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les frais supportés par l&apos;Utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 2 - COLLECTE DES DONNÉES
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Les données personnelles collectées par le site sont nécessaires pour la gestion des services proposés par Give&Collect. L&apos;Utilisateur dispose d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition de ses données personnelles.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 3 - PROPRIÉTÉ INTELLECTUELLE
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son, etc.) font l&apos;objet d&apos;une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d&apos;auteur.
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Give&Collect.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 4 - RESPONSABILITÉ
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Les sources des informations diffusées sur le site Give&Collect sont réputées fiables mais le site ne garantit pas qu&apos;il soit exempt de défauts, d&apos;erreurs ou d&apos;omissions. L&apos;Utilisateur est responsable de la sécurité de son matériel informatique et de ses données.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 5 - LIENS HYPERTEXTES
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Le site peut contenir des liens hypertextes vers d&apos;autres sites. Give&Collect n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à l&apos;accessibilité, le contenu, la publicité, les produits, les services disponibles sur ou à partir de ces sites.
                    </Typography>

                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Pour plus d&apos;informations, se reporter aux CGU du site Give&Collect accessibles à la rubrique &quot;CGU&quot;. Rédigé sur <a href="http://legalplace.fr" target="_blank" rel="noopener noreferrer">http://legalplace.fr</a>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default GeneralTerms;
