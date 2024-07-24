import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { CollectionPoint } from '@/types/collectionPoint';
import { styled } from '@mui/material/styles';

interface CollectionPointsCardProps {
    points: CollectionPoint[];
    onDelete: (id: number) => void;
}

const StatusChip = styled(Chip)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
    textTransform: 'uppercase',
}));

const CollectionPointsCard: React.FC<CollectionPointsCardProps> = ({ points, onDelete }) => {
    return (
        <>
            {points.map((point) => (
                <Card key={point.id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }} className="collection-point-card">
                    <CardContent>
                        <Typography variant="h6" gutterBottom data-testid={`description-${point.id}`}>
                            {point.description}
                        </Typography>
                        <Typography color="textSecondary" data-testid={`city-${point.id}`}>{point.city}</Typography>
                        <Typography color="textSecondary" data-testid={`postalCode-${point.id}`}>{point.postalCode}</Typography>
                        <Typography variant="body2" color="textSecondary" mt={1} data-testid={`address-${point.id}`}>
                            {point.address}
                        </Typography>
                        <Box mt={2}>
                            <StatusChip
                                label={point.isActive ? 'Actif' : 'Inactif'}
                                color={point.isActive ? 'success' : 'default'}
                                variant="outlined"
                                size="small"
                                sx={{ borderColor: point.isActive ? 'green' : 'red' }}
                                data-testid={`status-${point.id}`}
                            />
                        </Box>
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => onDelete(point.id)}
                                sx={{ borderRadius: 1 }}
                                data-testid={`delete-button-${point.id}`}
                            >
                                Supprimer
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default CollectionPointsCard;
