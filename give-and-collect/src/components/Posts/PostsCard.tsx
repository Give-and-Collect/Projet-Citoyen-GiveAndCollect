'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Pagination,
    SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import Image from 'next/image';
import { Session } from "next-auth";
import { Post } from '@/types/post';
import ContactAuthorModal from './ContactAuthorModal';

interface PostsCardProps {
    posts: Post[];
    session: Session | null | undefined;
    handlePostDelete: (id: number, authorId: number) => void;
}

const PostsCard: React.FC<PostsCardProps> = ({ posts, session, handlePostDelete }) => {
    const [selectedCity, setSelectedCity] = useState('Toutes');
    const [cities, setCities] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const postsPerPage = 5;

    useEffect(() => {
        const uniqueCities = Array.from(new Set(posts.map(post => post.city)));
        setCities(uniqueCities);
    }, [posts]);

    const handleCityChange = (event: SelectChangeEvent) => {
        setSelectedCity(event.target.value as string);
    };

    const handleOpenDialog = (post: Post) => {
        setCurrentPost(post);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentPost(null);
    };

    const filteredPosts = selectedCity === 'Toutes' ? posts : posts.filter(post => post.city === selectedCity);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, mb: 5 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 5 }}>
                <InputLabel>Choisissez une ville</InputLabel>
                <Select
                    value={selectedCity}
                    onChange={handleCityChange}
                    displayEmpty
                    label="Choisissez une ville"
                >
                    <MenuItem value="Toutes">Toutes</MenuItem>
                    {cities.map((city, index) => (
                        <MenuItem key={index} value={city}>{city}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ maxWidth: 1000, width: '100%' }}>
                {currentPosts.map((post) => (
                    <Card
                        key={post.id}
                        sx={{
                            mt: 5,
                            mb: 5,
                            maxWidth: 1000,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 15,
                            boxShadow: 10
                        }}
                    >
                        <CardHeader
                            title="Annonce"
                            style={{ textAlign: 'center', textTransform: 'uppercase', color: "#F4EEE0", backgroundColor: "#111D13" }}
                        />
                        <CardContent>
                            <Grid container spacing={1} alignItems="center" style={{ marginBottom: '20px' }}>
                                <Grid item>
                                    <Chip label={post.author.role.name} color="primary" sx={{ fontSize: '1rem', padding: '8px' }} />
                                </Grid>
                                <Grid item>
                                    <Chip label={post.postType.name} color="secondary" style={{ marginLeft: '5px' }} sx={{ fontSize: '1rem', padding: '8px' }} />
                                </Grid>
                            </Grid>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <Image src={'/assets/icones/profile-darkgreen.png'} alt="Profile" width={50} height={50} />
                                    <span style={{ marginLeft: '5px' }}>{post.author.firstname} {post.author.lastname}</span>
                                </div>
                            </div>
                            <Typography variant="body1" component="div" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image src={'/assets/icones/ping-darkgreen.png'} alt="Home" width={50} height={50} />
                                    <span style={{ marginLeft: '5px' }}>{post.city}, {post.postalCode}</span>
                                </div>
                            </Typography>
                            {/* Titre "Description" */}
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                Description
                            </Typography>
                            {/* Description */}
                            <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: '10px' }}>
                                {post.description}
                            </Typography>
                            {/* Tableau */}
                            <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#8bd59e' }}>
                                            <TableCell>Catégories</TableCell>
                                            <TableCell>Taille</TableCell>
                                            <TableCell>Genre</TableCell>
                                            <TableCell>Quantité</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {post.items.map((item, itemIndex) => (
                                            <TableRow key={itemIndex} sx={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : '#8bd59e' }}>
                                                <TableCell>{item.ItemCategory
                                                    .map(category => category.category)
                                                    .filter(category => category.type === 'category')
                                                    .map(category => category.name)
                                                    .join(', ')}</TableCell>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell>{item.ItemCategory
                                                    .map(category => category.category)
                                                    .filter(category => category.type === 'genre')
                                                    .map(category => category.name)
                                                    .join(', ')}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                                {session && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<EmailIcon/>}
                                        onClick={() => handleOpenDialog(post)} // Ouvre le modal pour contacter l'auteur
                                    >
                                        Contacter l&apos;auteur
                                    </Button>
                                )}
                                {(session?.user.roleId === 1 || session?.user.id === post.author.id) && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon/>}
                                        onClick={() => handlePostDelete(post.id, post.author.id)}
                                        data-testid={`delete-button-${post.id}`} // Assure-toi que l'ID est unique pour chaque bouton
                                        aria-label={`Supprimer l'annonce ${post.id}`}
                                    >
                                        Supprimer
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            {/* Pagination */}
            <Pagination
                count={Math.ceil(filteredPosts.length / postsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ mt: 5 }}
            />
            {/* Modal pour contacter l'auteur */}
            {currentPost && (
                <ContactAuthorModal
                    open={openDialog}
                    onClose={handleCloseDialog}
                    currentPost={currentPost}
                    session={session}
                />
            )}
        </Box>
    );
};

export default PostsCard;
