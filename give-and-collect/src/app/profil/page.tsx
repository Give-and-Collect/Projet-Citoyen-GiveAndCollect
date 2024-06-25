'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Avatar,
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
        profilePicture: null,
    });

    useEffect(() => {
        if (session) {
            fetchUserProfile(session.user.id);
        }
    }, [session]);

    const fetchUserProfile = async (userId) => {
        try {
            const response = await fetch(`/api/profil/${userId}`);
            const userData = await response.json();
            setUser(userData.user);
            setFormData({
                firstname: userData.user.firstname,
                lastname: userData.user.lastname,
                email: userData.user.email,
                phone: userData.user.phone,
                nomOrganisation: userData.user.nomOrganisation || '',
                profilePicture: userData.user.profilePicture || null,
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

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            profilePicture: e.target.files[0],
        }));
    };

    const handleUpdateUser = async () => {
        try {
            const data = new FormData();
            data.append('firstname', formData.firstname);
            data.append('lastname', formData.lastname);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('nomOrganisation', formData.nomOrganisation);
            data.append('profilePicture', formData.profilePicture);

            await fetch(`/api/profil/${user.id}`, {
                method: 'PUT',
                body: data,
            });
            fetchUserProfile(user.id);
            setEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await fetch(`/api/profil/${user.id}`, {
                method: 'DELETE',
            });
            window.location.href = '/profil'; // Redirection vers la liste des utilisateurs
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
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }} marginBottom={20}>
            <Card>
                <CardHeader title="Profil Utilisateur" />
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Avatar
                            alt={formData.firstname}
                            src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : '/default-avatar.png'}
                            sx={{ width: 100, height: 100 }}
                        />
                    </Box>
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
                        <Grid item xs={12} marginBottom={2}>
                            <FormControl fullWidth disabled={!editing}>
                                <FormLabel>Photo de profil</FormLabel>
                                <Input
                                    name="profilePicture"
                                    type="file"
                                    onChange={handleFileChange}
                                    disableUnderline
                                />
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
