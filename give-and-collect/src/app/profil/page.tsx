"use client";
// ProfilePage.tsx

import { useState, useEffect, FormEvent } from 'react';
import { getSession } from 'next-auth/react';
import { Session } from "next-auth";
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Avatar,
    Grid,
    Box,
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    nomOrganisation: string;
    profilePicture: string;
}

interface CustomSession extends Session {
    accessToken: string;
}

function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<CustomSession | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [nomOrganisation, setNomOrganisation] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await getSession() as CustomSession;
                if (session && session.accessToken) {
                    setSession(session);
                    const response = await fetch('/api/profil', {
                        headers: {
                            'Authorization': `Bearer ${session.accessToken}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data = await response.json();
                    setUser(data);
                    setFirstname(data.firstname);
                    setLastname(data.lastname);
                    setEmail(data.email);
                    setPhone(data.phone);
                    setNomOrganisation(data.nomOrganisation);
                    setProfilePicture(data.profilePicture);
                } else {
                    setError("No session found");
                }
            } catch (error: any) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (user && session) {
            const updatedUser = {
                ...user,
                firstname,
                lastname,
                email,
                phone,
                nomOrganisation,
                profilePicture,
            };

            try {
                const response = await fetch('/api/profil', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user data');
                }

                const updatedData = await response.json();
                setUser(updatedData);
            } catch (error: any) {
                console.error("Error updating user data:", error);
                setError(error.message);
            }
        }
    };


    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar alt="Profile Picture" src={user?.profilePicture} />
                    }
                    title={`${user?.firstname} ${user?.lastname}`}
                    subheader={user?.email}
                />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Prénom"
                                    variant="outlined"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    variant="outlined"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Numéro de télephone"
                                    variant="outlined"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nom d'organisation"
                                    variant="outlined"
                                    value={nomOrganisation}
                                    onChange={(e) => setNomOrganisation(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="error">
                                    Mettre à jour
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default ProfilePage;
