import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const LegalNotice = () => {
    return (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        Mentions légales
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontStyle: 'italic', color: 'text.secondary', marginBottom: 2, textAlign: 'center' }}>
                        En vigueur au 24/06/2024
                    </Typography>

                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs, ci-après l&quot;Utilisateur, du site Give&Collect, ci-après le &quot;Site&quot;, les présentes mentions légales. La connexion et la navigation sur le Site par l&quot;Utilisateur implique acceptation intégrale et sans réserve des présentes mentions légales. Ces dernières sont accessibles sur le Site à la rubrique &quot;Mentions légales&quot;.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 1 - L&apos;EDITEUR
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        L&apos;édition et la direction de la publication du Site est assurée par Marina ASHRAF MORIS, domiciliée 66 Rue Paul Helot, dont le numéro de téléphone est 0753975679, et l&apos;adresse e-mail marina.ashrafmoris@viacesi.fr, ci-après l&quot;Editeur.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 2 - L&apos;HEBERGEUR
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        L&apos;hébergeur du Site est la société Vercel, dont le siège social est situé au [adresse de l&apos;hébergeur], avec le numéro de téléphone : [numéro de téléphone] et adresse email de contact.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 3 - ACCES AU SITE
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Le Site est accessible en tout endroit, 7j/7, 24h/24 sauf cas de force majeure, interruption programmée ou non et pouvant découler d’une nécessité de maintenance. En cas de modification, interruption ou suspension du Site, l&apos;Editeur ne saurait être tenu responsable.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                        ARTICLE 4 - COLLECTE DES DONNEES
                    </Typography>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Le Site assure à l&apos;Utilisateur une collecte et un traitement d&apos;informations personnelles dans le respect de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l&apos;informatique, aux fichiers et aux libertés. En vertu de la loi Informatique et Libertés, en date du 6 janvier 1978, l&apos;Utilisateur dispose d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition de ses données personnelles. L&apos;Utilisateur exerce ce droit :
                    </Typography>
                    <Box component="div" sx={{ marginLeft: 2, marginBottom: 2 }}>
                        <Typography component="div" paragraph>- par mail à l&apos;adresse email givecollect@gmail.com</Typography>
                        <Typography component="div" paragraph>- via un formulaire de contact</Typography>
                    </Box>
                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du Site, sans autorisation de l&quot;Editeur est prohibée et pourra entraîner des actions et poursuites judiciaires telles que notamment prévues par le Code de la propriété intellectuelle et le Code civil.
                    </Typography>

                    <Typography component="div" paragraph sx={{ textAlign: 'justify', marginBottom: 2 }}>
                        Pour plus d’informations, se reporter aux CGU du site Give&Collect accessible à la rubrique &quot;CGU&quot;. Rédigé sur <a href="http://legalplace.fr" target="_blank" rel="noopener noreferrer">http://legalplace.fr</a>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LegalNotice;
