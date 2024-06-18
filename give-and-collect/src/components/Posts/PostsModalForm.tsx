import React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    IconButton,
    Button,
    SelectChangeEvent
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { FormData, Ligne } from '../../types/post';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface PostsModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    categories: string[];
    handleAddLine: () => void;
    handleDeleteLine: (index: number) => void;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
        index: number,
        field: keyof Ligne
    ) => void;
    handlePublish: () => Promise<void>;
    types: {id: number, name: string}[]
    genres: string[]
}

const PostsModalForm: React.FC<PostsModalFormProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           formData,
                                                           setFormData,
                                                           categories,
                                                           handleAddLine,
                                                           handleDeleteLine,
                                                           handleChange,
                                                           handlePublish,
                                                           types,
                                                           genres
                                                       }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Postez une annonce
                </Typography>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresse"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ville"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Code Postal"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrption"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {types.map(type => (<MenuItem value={type.id}>{type.name}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {formData.lignes.map((line, index) => (
                            <Grid container item spacing={2} alignItems="center" key={index}>
                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Catégorie</InputLabel>
                                        <Select
                                            value={line.categorie}
                                            onChange={(e) => handleChange(e as SelectChangeEvent<string>, index, 'categorie')}
                                        >
                                            <MenuItem value="">
                                                <em>Sélectionnez une catégorie</em>
                                            </MenuItem>
                                            {categories.map((category, i) => (
                                                <MenuItem key={i} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        label="Taille"
                                        value={line.taille}
                                        onChange={(e) => handleChange(e, index, 'taille')}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Genre</InputLabel>
                                        <Select
                                            value={line.genre}
                                            onChange={(e) => handleChange(e as SelectChangeEvent<string>, index, 'genre')}
                                        >
                                            {genres.map((genre) => (<MenuItem value={genre} key={genre}>{genre}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        label="Quantité"
                                        type="number"
                                        value={line.quantite}
                                        onChange={(e) => handleChange(e, index, 'quantite')}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    {index > 0 && (
                                        <IconButton onClick={() => handleDeleteLine(index)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button variant="contained" sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }} onClick={handleAddLine} fullWidth>
                                Ajouter une ligne
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="success" onClick={handlePublish} fullWidth>
                                Publier l'annonce
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="error" onClick={onClose} fullWidth>
                                Annuler
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default PostsModalForm;
