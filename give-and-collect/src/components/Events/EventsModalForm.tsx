import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Session } from "next-auth";
import { useState } from "react";

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
    maxHeight: '90vh',
    overflowY: 'auto'
};

interface EventsModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onEventCreated: () => void;
    session: Session;
}

const EventsModalForm: React.FC<EventsModalFormProps> = ({
    isOpen,
    onClose,
    onEventCreated,
    session
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);

    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
    
        const start = new Date(startDate);
        start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
        const startUTC = start.toISOString();
    
        const end = new Date(endDate);
        end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
        const endUTC = end.toISOString();
    
        if (endUTC <= startUTC) {
            setError('La date de fin doit être supérieure à la date de début.');
            return;
        }
    
        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                address,
                city,
                postalCode,
                latitude: 1.0,
                longitude: 1.0,
                startDate: startUTC,
                endDate: endUTC,
                phone,
                organizerId: session.user.id
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Une erreur est survenue.');
                }

                return response.json();
            })
            .then(() => {
                onEventCreated();
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom color={'primary'}>
                    Créez un évènement :
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            id="title"
                            label="Titre de l'évènement"
                            variant="outlined"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            required
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <TextField
                            id="address"
                            label="Adresse"
                            variant="outlined"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <TextField
                            id="city"
                            label="Ville"
                            variant="outlined"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />

                        <TextField
                            id="postalCode"
                            label="Code postal"
                            type="number"
                            variant="outlined"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />

                        <TextField
                            id="startDate"
                            label="Date de début"
                            InputLabelProps={{ shrink: true }}
                            type="datetime-local"
                            variant="outlined"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />

                        <TextField
                            id="endDate"
                            label="Date de fin"
                            InputLabelProps={{ shrink: true }}
                            type="datetime-local"
                            variant="outlined"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />

                        <TextField
                            id="phone"
                            label="Téléphone"
                            helperText="Exemple : 0123456789"
                            type="tel"
                            variant="outlined"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        {error && (
                            <Typography color="error">
                                {error}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                        >
                            Créer
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default EventsModalForm;
