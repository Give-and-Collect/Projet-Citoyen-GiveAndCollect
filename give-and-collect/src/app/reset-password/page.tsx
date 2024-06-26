"use client";

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, Card, IconButton, InputAdornment } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [secretQuestion, setSecretQuestion] = useState('');
    const [secretAnswer, setSecretAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isEmailValid = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailSubmit = async () => {
        setError('');
        setSecretQuestion('');

        if (email !== '' && isEmailValid(email)) {
            const response = await fetch(`/api/reset-password/${email}`);

            const result = await response.json();
            if (result.secretQuestion) {
                setSecretQuestion(result.secretQuestion);
            } else {
                setError(result.message);
            }
        } else {
            setError('Veuillez entrer une adresse email valide.');
        }
    };

    const handleResetSubmit = async () => {
        if (secretAnswer === '') {
            setError('Veuillez répondre à la question secrète.');
            return;
        }

        if (newPassword === '' || confirmPassword === '') {
            setError('Veuillez entrer un mot de passe.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (!isPasswordStrong(newPassword).isStrongEnough) {
            setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.');
            return;
        }

        const response = await fetch(`/api/reset-password/${email}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, secretAnswer, newPassword }),
        });

        const result = await response.json();
        if (result.success) {
            window.location.href = '/login';
        } else {
            setError(result.message);
        }
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
                    border: '1px solid',
                    borderColor: 'black',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 12px 10px',
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
                    <Typography component="h1" variant="h5">
                        Réinitialiser le mot de passe
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            fullWidth
                            padding="30px"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 1 }}
                            onClick={handleEmailSubmit}
                        >
                            Obtenir la question secrète
                        </Button>
                        {!!secretQuestion && (
                            <>
                                <Typography variant="h7">
                                    {secretQuestion}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="secretAnswer"
                                    label="Réponse à la question secrète"
                                    id="secretAnswer"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => setSecretAnswer(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="Nouveau mot de passe"
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    autoComplete="new-password"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => setNewPassword(e.target.value)}
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
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Force du mot de passe : {evaluatePasswordStrength(newPassword)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {isPasswordStrong(newPassword).containsUppercase ?
                                            <span style={{ color: 'green' }}>&#10004;</span> :
                                            <span style={{ color: 'red' }}>&#10060;</span>} Contient une majuscule
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {isPasswordStrong(newPassword).containsSpecialCharacter ?
                                            <span style={{ color: 'green' }}>&#10004;</span> :
                                            <span style={{ color: 'red' }}>&#10060;</span>} Contient un caractère spécial
                                    </Typography>
                                </Grid>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirmer le nouveau mot de passe"
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                <Button
                                    fullWidth
                                    padding="30px"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 1 }}
                                    onClick={handleResetSubmit}
                                >
                                    Réinitialiser le mot de passe
                                </Button>
                            </>
                        )}
                        {!!error && (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        )}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Retour à la connexion
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
};

export default ResetPassword;