import { Box, Card, CardContent, CardHeader, Typography, Chip, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import React from 'react';
import Image from 'next/image';

interface PostItem {
    size: string;
    quantity: number;
    categories: { id: number; itemId: number; categoryId: number }[];
}

interface Post {
    id: number; // Ajout de l'ID pour trier
    address: string;
    city: string;
    postalCode: string;
    description: string;
    author: {
        firstname: string;
        lastname: string;
        roleId: string; // Ajout du champ role
    };
    postType: {
        name: string;
    };
    items: PostItem[];
}

interface PostsCardProps {
    posts: Post[];
}

const PostsCard: React.FC<PostsCardProps> = ({ posts }) => {
    // Tri des annonces par ID décroissant
    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
            <Box sx={{ maxWidth: 1000, width: '100%' }}>
                {sortedPosts.map((post) => (
                    <Card
                        key={post.id} // Utilisation de l'ID comme clé
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
                            {/* Première ligne */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                {/* Image et nom de l'auteur */}
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <Image src={'/assets/icones/profile-darkgreen.png'} alt="Profile" width={50} height={50} />
                                    <span style={{ marginLeft: '5px' }}>{post.author.firstname} {post.author.lastname}</span>
                                </div>
                                {/* Tags et type de poste alignés à gauche */}
                                <Grid container spacing={1} alignItems="center" style={{ marginLeft: '-8px' }}>
                                    <Grid item>
                                        <Chip label={post.author.roleId} color="primary" sx={{ fontSize: '1rem', padding: '8px' }} />
                                    </Grid>
                                    <Grid item>
                                        <Chip label={post.postType.name} color="secondary" style={{ marginLeft: '5px' }} sx={{ fontSize: '1rem', padding: '8px' }} />
                                    </Grid>
                                </Grid>
                            </div>
                            {/* Deuxième ligne avec l'adresse */}
                            <Typography variant="body1" component="div" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                {/* Adresse */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image src={'/assets/icones/ping-darkgreen.png'} alt="Home" width={50} height={50} />
                                    <span style={{ marginLeft: '5px' }}>{post.address}, {post.city}, {post.postalCode}</span>
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
                                        <TableRow style={{ backgroundColor: '#e0f7fa' }}>
                                            <TableCell>Taille</TableCell>
                                            <TableCell>Quantité</TableCell>
                                            <TableCell>Catégories</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {post.items.map((item, itemIndex) => (
                                            <TableRow key={itemIndex} sx={{ backgroundColor: itemIndex % 2 === 0 ? '#ffffff' : '#e0f7fa' }}>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.categories.map(category => category.categoryId).join(', ')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default PostsCard;
