"use client";

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';

const UserProfilePage = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        nomOrganisation: '',
        profilePicture: '',
        roleId: '',
    });

    useEffect(() => {
        if (session) {
            fetchUserProfile(session.user.id);
        }
    }, [session]);

    useEffect(() => {
        console.log('User data from session:', user);
    }, [user]);

    console.log(session, 'test id');

    const fetchUserProfile = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`);
            const userData = await response.json();
            setUser(userData.user);
            setFormData({
                firstname: userData.user.firstname,
                lastname: userData.user.lastname,
                email: userData.user.email,
                phone: userData.user.phone,
                nomOrganisation: userData.user.nomOrganisation || '',
                profilePicture: userData.user.profilePicture || '',
                roleId: userData.user.roleId.toString(),
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleEditToggle = () => {
        setEditing((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateUser = async () => {
        try {
            await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            fetchUserProfile(user.id); // Actualiser les données utilisateur après la mise à jour
            setEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await fetch(`/api/users/${user.id}`, {
                method: 'DELETE',
            });
            // Rediriger ou gérer la suppression selon vos besoins
            window.location.href = '/users'; // Redirection vers la liste des utilisateurs
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    if (status === 'loading') {
        return <Typography variant="body1">Chargement...</Typography>;
    }

    if (!session) {
        return <Typography variant="body1">Connectez-vous pour accéder à cette page.</Typography>;
    }

    if (!user) {
        return <Typography variant="body1">Chargement du profil...</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
            <Card>
                <CardHeader title="Profil Utilisateur" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="firstname"
                                label="Prénom"
                                value={formData.firstname}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="lastname"
                                label="Nom de famille"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="phone"
                                label="Téléphone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="nomOrganisation"
                                label="Nom de l'organisation"
                                value={formData.nomOrganisation}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="profilePicture"
                                label="Photo de profil"
                                value={formData.profilePicture}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth disabled={!editing}>
                                <InputLabel>Rôle</InputLabel>
                                <Select
                                    name="roleId"
                                    value={formData.roleId}
                                    onChange={handleChange}
                                >
                                    {/* Remplacez par les rôles réels récupérés depuis votre API */}
                                    <MenuItem value="1">Admin</MenuItem>
                                    <MenuItem value="2">Utilisateur</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {editing ? (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button onClick={handleUpdateUser} variant="contained" color="primary" sx={{ mr: 2 }}>
                                Enregistrer
                            </Button>
                            <Button onClick={handleEditToggle} variant="outlined" color="secondary">
                                Annuler
                            </Button>
                        </Box>
                    ) : (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button onClick={handleEditToggle} variant="outlined">
                                Modifier
                            </Button>
                            <Button onClick={handleDeleteUser} variant="outlined" color="error" sx={{ ml: 2 }}>
                                Supprimer
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserProfilePage;
