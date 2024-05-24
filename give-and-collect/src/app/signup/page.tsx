"use client";

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Grid, Avatar, MenuItem, Card } from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Signup() {
    const [userType, setUserType] = useState('');
    const [dob, setDob] = useState<Date | null>(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        nomOrganisation: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, birthDate: dob, userType }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                }
            })
            .then(data => {
                window.alert('Votre compte a bien été enregistré');
                window.location.href = '/signin';
            })
            .catch(error => {
                if (error.message === 'Email already exists') {
                    window.alert('L\'adresse email est déjà utilisée');
                } else if (error.message === 'Phone number already exists') {
                    window.alert('Le numéro de téléphone est déjà utilisé');
                } else {
                    window.alert('L\'inscription a échoué. Veuillez réessayer plus tard.');
                }
            });
    };


    return (
        <Container component="main" maxWidth="xs">
            <Card
                variant="outlined"
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
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
                            id="firstname"
                            label="Prénom"
                            name="firstname"
                            autoComplete="given-name"
                            autoFocus
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.firstname}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="lastname"
                            label="Nom"
                            name="lastname"
                            autoComplete="family-name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.lastname}
                            onChange={handleChange}
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
                            value={formData.email}
                            onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
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
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="address"
                            label="Adresse"
                            type="text"
                            id="address"
                            autoComplete="street-address"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.address}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="city"
                            label="Ville"
                            type="text"
                            id="city"
                            autoComplete="address-level2"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.city}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="postalCode"
                            label="Code postal"
                            type="text"
                            id="postalCode"
                            autoComplete="postal-code"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.postalCode}
                            onChange={handleChange}
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
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 3, padding: '15px' }}
                        >
                            S'inscrire
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/singin" variant="body2">
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
