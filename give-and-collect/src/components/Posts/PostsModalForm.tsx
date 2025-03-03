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
    width: '90%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    maxHeight: '90vh', // Limiter la hauteur maximale
    overflowY: 'auto'  // Activer le défilement vertical
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
    types: { id: number, name: string }[];
    genres: string[];
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
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ville"
                                type="text"
                                value={formData.city}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[a-zA-Z\s]*$/.test(value)) {
                                        setFormData({ ...formData, city: value });
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Code Postal"
                                type="text"  // Utiliser type="text" pour permettre des validations personnalisées
                                value={formData.postalCode}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setFormData({ ...formData, postalCode: value });
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    inputProps={{ 'data-testid': 'type-select' }}
                                >
                                    {types.map(type => (
                                        <MenuItem key={type.id} value={type.id} data-testid={`type-option-${type.id}`}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData.lignes.map((line, index) => (
                            <Grid container item spacing={2} alignItems="center" key={index}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id={"type-category-" + index}>Catégorie</InputLabel>
                                        <Select
                                            labelId={"type-category-" + index}
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
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Taille"
                                        value={line.taille}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index, 'taille')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id={"type-genre-" + index}>Genre</InputLabel>
                                        <Select
                                            labelId={"type-genre-" + index}
                                            value={line.genre}
                                            onChange={(e) => handleChange(e as SelectChangeEvent<string>, index, 'genre')}
                                        >
                                            {genres.map((genre) => (
                                                <MenuItem value={genre} key={genre}>{genre}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Quantité"
                                        type="number"
                                        value={line.quantite}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index, 'quantite')}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1}>
                                    <IconButton onClick={() => handleDeleteLine(index)} color="secondary">
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button variant="contained" sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }} onClick={handleAddLine} fullWidth>
                                Ajouter une Article
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" color="success" onClick={handlePublish} fullWidth>
                                Publier l&apos;annonce
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
