"use client";

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Grid, Card } from '@mui/material';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

type Props = {
    callbackUrl?: string;
    error?: string;
};

export default function Login(props: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async () => {
        await signIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: props.callbackUrl ?? '/',
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
                    <Image src={'/assets/icones/profile-darkgreen.png'} alt="logo" width={150} height={150} />
                    <Typography component="h1" variant="h5">
                        Se connecter
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
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {!!props.error && (
                            <Typography variant="body2" color="error">
                                Email ou mot de passe incorrect
                            </Typography>
                        )}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/reset-password" variant="body2">
                                    Mot de passe oublié ?
                                </Link>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            padding="30px"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 1 }}
                            onClick={handleSubmit}
                        >
                            Se connecter
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    Pas encore de compte ? Inscrivez-vous
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
}