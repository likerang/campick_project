'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "../../utils/supabase/client"; // Changed to client

export default function LogoutPage() {
    const router = useRouter();
    
    useEffect(() => {
        const logout = async () => {
            const supabase = createClient(); // Move inside useEffect
            await supabase.auth.signOut();
            router.push('/');
        };

        logout();
    }, [router]);

    return (
        <div>
            <p>로그아웃 중...</p>
        </div>
    );
}