'use client';

import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    styled
} from '@mui/material';
import { Send, Subject, Message, Email } from '@mui/icons-material';
import { Session } from "next-auth";
import { Post } from "@/types/post";

interface ContactAuthorModalProps {
    open: boolean;
    onClose: () => void;
    currentPost: Post;
    session: Session | null | undefined;
}

const sanitizeInput = (input: string): string => {
    return input.replace(/[^a-zA-Z0-9\s]/g, ''); // Filtrer uniquement les lettres, chiffres et espaces
};

const validateForm = (subject: string, message: string, authorEmail: string, userConnectedEmail: string, userConnectedFirstName: string): boolean => {
    const inputs = [subject, message, authorEmail, userConnectedEmail, userConnectedFirstName];
    if (inputs.some(input => input.trim().length === 0)) {
        return false; // Vérifier que tous les champs sont remplis
    }
    return true;
};

const CustomButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    width: '100%',
    padding: theme.spacing(1.5),
    fontSize: '1rem'
}));

const ContactAuthorModal: React.FC<ContactAuthorModalProps> = ({ open, onClose, currentPost, session }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSubject(sanitizeInput(value));
    };

    const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setMessage(sanitizeInput(value));
    };

    const handleSubmit = () => {
        if (!validateForm(subject, message, currentPost.author.email, session?.user.email!, session?.user.firstname!)) {
            setErrorMessage('Veuillez remplir tous les champs.');
            return;
        }

        fetch('/api/sendMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                message: message,
                authorEmail: currentPost.author.email,
                userConnectedEmail: session?.user.email,
                userConnectedFirstName: session?.user.firstname
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de l\'envoi du message.');
                }
                return response.json();
            })
            .then(() => {
                alert('Message envoyé avec succès');
                onClose();
            })
            .catch((error) => {
                console.log(error.message);
                alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.");
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Contacter l'auteur</DialogTitle>
            <DialogContent>
                <Box sx={{ marginBottom: 2, marginTop: 2 }}>
                    <TextField
                        label="De:"
                        value={session?.user?.email}
                        disabled
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton color="primary">
                                        <Email />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Objet"
                        value={subject}
                        onChange={handleChangeSubject}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton color="primary">
                                        <Subject />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Message"
                        value={message}
                        onChange={handleChangeMessage}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton color="primary">
                                        <Message />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {errorMessage && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <CustomButton
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        endIcon={<Send color="primary" />}
                    >
                        Envoyer
                    </CustomButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ContactAuthorModal;
