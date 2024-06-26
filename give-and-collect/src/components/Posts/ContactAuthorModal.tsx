'use client';

// ContactAuthorModal.tsx

import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button
} from '@mui/material';
import {Session} from "next-auth";
import {Post} from "@/types/post";

interface ContactAuthorModalProps {
    open: boolean;
    onClose: () => void;
    currentPost: Post;
    session:Session | null | undefined;
}

const ContactAuthorModal: React.FC<ContactAuthorModalProps> = ({ open, onClose, currentPost, session }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    console.log("session email", session?.user.email);
    const handleSubmit = () => {
        // Handle submission logic here (e.g., sending email)

        fetch('/api/sendMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject:subject,
                message:message,
                authorEmail:currentPost.author.email,
                userConnectedEmail:session?.user.email,
                userConnectedFirstName:session?.user.firstname
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Une erreur est survenue.');
                }

                return response.json();
            })
            .then(() => {
                onClose();
            })
            .catch((error) => {
                console.log(error.message)
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Contacter l'auteur</DialogTitle>
            <DialogContent>
                <Box sx={{ marginBottom: 2 }}>
                    <TextField
                        label="De:"
                        value={session?.user?.email} // Email de l'utilisateur connecté
                        disabled
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="À:"
                        value={currentPost.author.email} // Email de l'auteur du post
                        disabled
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Objet"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Envoyer
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ContactAuthorModal;
