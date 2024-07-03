"use client";
import Navbar from '@/Components/Navbar/Navbar';
import React, { useEffect } from 'react';

export default function ProtectedPage() {

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await res.json();

                if (!data.ok) {
                    window.location.href = '/auth/signin';
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                window.location.href = '/auth/signin';
            }
        };

        checkAuth();
    }, []);

    return (
        <div>
            <h1>Welcome to the Protected Page!</h1>
            {/* Your protected page content goes here */}

            <Navbar/>
        </div>
    );
}
