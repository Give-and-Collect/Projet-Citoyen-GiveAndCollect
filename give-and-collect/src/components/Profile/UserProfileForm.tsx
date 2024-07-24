import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormLabel,
    Grid,
    Input,
    TextField,
    Chip,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface FormData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    nomOrganisation: string;
    profilePicture: File | null;
    profilePictureBase64: string;
    roleId: string;
    roleName: string;
}

interface UserProfileFormProps {
    formData: FormData;
    editing: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditToggle: () => void;
    handleUpdateUser: () => void;
    handleDeleteUser: () => void;
}

const UserProfileForm = ({
                             formData,
                             editing,
                             handleChange,
                             handleFileChange,
                             handleEditToggle,
                             handleUpdateUser,
                             handleDeleteUser,
                         }: UserProfileFormProps) => {
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }} marginBottom={20}>
            <Card>
                <CardHeader title="Profil Utilisateur" />
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <AccountCircleIcon sx={{ fontSize: 170 }} />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Chip label={`Role: ${formData.roleName}`} color="secondary" />
                        </Grid>
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

export default UserProfileForm;
