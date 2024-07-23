'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import UserProfileForm from '@/components/Profile/UserProfileForm';
import {UserProfile, FormData} from '@/types/profile';
import Loader from '@/components/Loader/Loader';

const UserProfilePage = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        nomOrganisation: '',
        profilePicture: null,
        profilePictureBase64: '',
        roleId: '',
        roleName: '',
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchUserProfile(session.user.id);
        }
    }, [session]);

    const fetchUserProfile = async (userId: number) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/profil/${userId}`);
            const userData = await response.json();
            setUser({
                ...userData.user,
                roleName: userData.user.role.name,
            });
            setFormData({
                firstname: userData.user.firstname,
                lastname: userData.user.lastname,
                email: userData.user.email,
                phone: userData.user.phone,
                nomOrganisation: userData.user.nomOrganisation || '',
                profilePicture: userData.user.profilePicture || null,
                profilePictureBase64: '',
                roleId: userData.user.roleId,
                roleName: userData.user.role.name,
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditToggle = () => {
        setEditing((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            profilePicture: file,
        }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string | null;
                if (result) {
                    const base64String = result.replace("data:", "").replace(/^.+,/, "");
                    setFormData((prev) => ({
                        ...prev,
                        profilePictureBase64: base64String,
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateUser = async () => {
        if (!user) return;

        try {
            const data = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                phone: formData.phone,
                nomOrganisation: formData.nomOrganisation,
                profilePicture: formData.profilePictureBase64,
                roleId: formData.roleId,
            };

            await fetch(`/api/profil/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            await fetchUserProfile(user.id);
            setEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (!user) return;

        const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.');
        if (confirmed) {
            try {
                await fetch(`/api/profil/${user.id}`, {
                    method: 'DELETE',
                });
                signOut();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    return (
        <>
        {isLoading ? (
            <Loader />
        ) : (
            <UserProfileForm
                formData={formData}
                editing={editing}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleEditToggle={handleEditToggle}
                handleUpdateUser={handleUpdateUser}
                handleDeleteUser={handleDeleteUser}
            />
        )}
        </>
    );
};

export default UserProfilePage;