"use client";

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Grid, MenuItem, Card, IconButton, InputAdornment } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import differenceInYears from 'date-fns/differenceInYears'; // Importez cette fonction pour vérifier l'âge

interface Role {
    id: number;
    name: string;
}

export default function Signup() {
    const [role, setRole] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState<number>(0);
    const [dob, setDob] = useState<Date | null>(null);
    const [showOrganisationNameField, setShowOrganisationNameField] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        nomOrganisation: '',
    });

    useEffect(() => {
        fetch('/api/role')
            .then(response => response.json())
            .then(data => {
                // Filtrer les rôles pour exclure le rôle admin (id = 1)
                const filteredRoles = data.filter((role: Role) => role.id !== 1);
                setRole(filteredRoles);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des rôles:', error);
            });
    }, []);

    const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedRoleId = event.target.value as number;
        setRoleId(selectedRoleId);
        setShowOrganisationNameField(selectedRoleId === 4 || selectedRoleId === 3);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isEmailValid = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPhoneValid = (phone: string): boolean => {
        const phoneRegex = /^(?:0|\+33|0033)[1-9][0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const isPasswordStrong = (password: string) => {
        const containsUppercase = /[A-Z]/.test(password);
        const containsSpecialCharacter = /[^A-Za-z0-9]/.test(password);

        const isStrongEnough = password.length >= 8 && containsUppercase && containsSpecialCharacter;
        return { isStrongEnough, containsUppercase, containsSpecialCharacter };
    };

    const evaluatePasswordStrength = (password: string) => {
        const passwordLength = password.length;
        let strength = 'Faible';
        if (passwordLength >= 12) {
            strength = 'Fort';
        } else if (passwordLength >= 8) {
            strength = 'Moyen';
        }
        return strength;
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        if (!isEmailValid(formData.email)) {
            alert("L'adresse e-mail n'est pas valide");
            return;
        }

        if (!isPhoneValid(formData.phone)) {
            alert("Le numéro de téléphone n'est pas valide");
            return;
        }

        if (dob && differenceInYears(new Date(), dob) < 18) {
            alert("Vous devez avoir au moins 18 ans pour vous inscrire");
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, birthDate: dob, roleId }),
            });

            if (response.ok) {
                const data = await response.json();
                window.alert('Votre compte a bien été enregistré');
                signIn();
            } else {
                const errorData = await response.json();
                if (errorData.error === 'Email already exists') {
                    window.alert("L'adresse email est déjà utilisée");
                } else if (errorData.error === 'Phone number already exists') {
                    window.alert("Le numéro de téléphone est déjà utilisé");
                } else {
                    window.alert('L\'inscription a échoué. Veuillez réessayer plus tard.');
                }
            }
        } catch (error) {
            window.alert('L\'inscription a échoué. Veuillez réessayer plus tard.');
        }
    };

    return (
        <Container component="main" maxWidth="md">
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
                    <Image
                        src="/assets/icones/profile-darkgreen.png"
                        alt="Image de profil"
                        width={170}
                        height={170}
                    />
                    <Typography component="h1" variant="h5">
                        S&apos;inscrire
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} width="100%">
                        <Grid container spacing={2}>
                            {/* Prénom */}
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            {/* Nom */}
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            {/* Email */}
                            <Grid item xs={12}>
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
                            </Grid>
                            {/* Mot de passe */}
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Mot de passe"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={togglePasswordVisibility}
                                                    edge="end"
                                                    style={{ backgroundColor: 'black' }}
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            {/* Force du mot de passe */}
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Force du mot de passe : {evaluatePasswordStrength(formData.password)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {isPasswordStrong(formData.password).containsUppercase ?
                                        <span style={{ color: 'green' }}>&#10004;</span> :
                                        <span style={{ color: 'red' }}>&#10060;</span>} Contient une majuscule
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {isPasswordStrong(formData.password).containsSpecialCharacter ?
                                        <span style={{ color: 'green' }}>&#10004;</span> :
                                        <span style={{ color: 'red' }}>&#10060;</span>} Contient un caractère spécial
                                </Typography>
                            </Grid>
                            {/* Confirmer le mot de passe */}
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirmer le mot de passe"
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={togglePasswordVisibility}
                                                    edge="end"
                                                    style={{ backgroundColor: 'black' }}
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            {/* Message d'erreur si les mots de passe ne correspondent pas */}
                            {formData.password !== formData.confirmPassword && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="error">
                                        Les mots de passe ne correspondent pas
                                    </Typography>
                                </Grid>
                            )}
                            {/* Date de naissance */}
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            {/* Numéro de téléphone */}
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            {/* Vous êtes */}
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    select
                                    label="Vous êtes"
                                    value={roleId}
                                    onChange={handleRoleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                    {role.map(role => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/* Nom de l'organisation */}
                            {showOrganisationNameField && (
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="nomOrganisation"
                                        label={roleId === 4 ? "Nom de votre entreprise" : "Nom de votre association"}
                                        name="nomOrganisation"
                                        autoComplete="organization"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={formData.nomOrganisation}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        {/* Bouton S'inscrire */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 3, padding: '15px' }}
                        >
                            S&apos;inscrire
                        </Button>
                        {/* Lien vers la page de connexion */}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => signIn('credentials', { redirect: true })}>
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
