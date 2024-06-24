"use client";

import { useState, useEffect, FormEvent } from 'react';
import { getSession } from 'next-auth/react';
import { Session } from "next-auth";
import Image from 'next/image';

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    nomOrganisation: string;
    profilePicture: string;
}

interface CustomSession extends Session {
    accessToken: string;
}

function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<CustomSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [nomOrganisation, setNomOrganisation] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const session = await getSession();
                console.log("Session:", session);
                if (session && 'accessToken' in session) {
                    setSession(session as CustomSession);
                    const response = await fetch('/api/profil', {
                        headers: {
                            'Authorization': `Bearer ${session.accessToken}`
                        }
                    });
                    console.log("Response status:", response.status);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data = await response.json();
                    console.log("User data:", data);
                    setUser(data);
                    setFirstname(data.firstname);
                    setLastname(data.lastname);
                    setEmail(data.email);
                    setPhone(data.phone);
                    setNomOrganisation(data.nomOrganisation);
                    setProfilePicture(data.profilePicture);
                } else {
                    setError("No session found");
                }
            } catch (error: any) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (user && session) {
            const updatedUser = {
                ...user,
                firstname,
                lastname,
                email,
                phone,
                nomOrganisation,
                profilePicture,
            };

            try {
                const response = await fetch('/api/profil', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user data');
                }

                const updatedData = await response.json();
                console.log("Updated user data:", updatedData);
                setUser(updatedData);
            } catch (error: any) {
                console.error("Error updating user data:", error);
                setError(error.message);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{user ? `${user.firstname} ${user.lastname}` : 'Loading...'}</h1>
            <p>Email: {user ? user.email : 'Loading...'}</p>
            <p>Phone: {user ? user.phone : 'Loading...'}</p>
            <p>Organisation: {user ? user.nomOrganisation : 'Loading...'}</p>
            {user && user.profilePicture ? (
                <Image src={user.profilePicture} alt="Profile" width={150} height={150} />
            ) : (
                <p>Loading image...</p>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    First name:
                    <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} />
                </label>
                <label>
                    Last name:
                    <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Phone:
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                </label>
                <label>
                    Organisation:
                    <input type="text" value={nomOrganisation} onChange={e => setNomOrganisation(e.target.value)} />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default ProfilePage;
