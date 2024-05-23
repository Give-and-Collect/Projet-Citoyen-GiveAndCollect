"use client";

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Grid, Avatar, MenuItem, Card } from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Signup() {
    const [userType, setUserType] = useState('');
    const [dob, setDob] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card
                variant="outlined"
                sx={{
                    marginTop: 8,
                    marginBottom: 8, // Correction de "marginButton" à "marginBottom"
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    borderRadius: 8,
                    boxShadow: 5,
                    border: '1px solid',
                    borderColor: 'black',
                }}
            >
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AccountCircleSharpIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        S'inscrire
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Date de naissance"
                                value={dob}
                                onChange={(newValue) => setDob(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        margin="normal"
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="Prénom"
                            name="firstName"
                            autoComplete="given-name"
                            autoFocus
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Nom"
                            name="lastName"
                            autoComplete="family-name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirmer le mot de passe"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="phone"
                            label="Numéro de téléphone"
                            type="tel"
                            id="phone"
                            autoComplete="tel"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            select
                            label="Vous êtes"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        >
                            <MenuItem value="particulier">Particulier</MenuItem>
                            <MenuItem value="entreprise">Entreprise</MenuItem>
                            <MenuItem value="association">Association</MenuItem>
                        </TextField>
                        {(userType === 'entreprise' || userType === 'association') && (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="organizationName"
                                label={userType === 'entreprise' ? "Nom de votre entreprise" : "Nom de votre association"}
                                name="organizationName"
                                autoComplete="organization"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            padding="30px"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 3 }}
                        >
                            S'inscrire
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Déjà inscrit? Connectez-vous
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
}
