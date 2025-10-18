// File: app/api/profile/mfa/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to get Supabase client and session
async function getSupabaseAndSession() {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
            },
        }
    );
    const { data: { session }, error } = await supabase.auth.getSession();
    return { supabase, session, error };
}

// --- GET: List enrolled factors for the current user ---
export async function GET(request: NextRequest) {
    const { supabase, session, error: sessionError } = await getSupabaseAndSession();

    if (sessionError || !session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) throw error;
        // Return only relevant info (e.g., id, status, factor_type) for simplicity
        const factors = data.all.map(f => ({ id: f.id, status: f.status, type: f.factorType }));
        return NextResponse.json({ factors });
    } catch (error: any) {
        console.error('MFA GET Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to list factors' }, { status: 500 });
    }
}


// --- POST: Handles various MFA actions based on 'action' in body ---
export async function POST(request: NextRequest) {
    const { supabase, session, error: sessionError } = await getSupabaseAndSession();

    if (sessionError || !session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { action, factorId, code, challengeId } = body;

    try {
        switch (action) {
            // --- Action: Start Enrollment (TOTP) ---
            case 'enroll':
                const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
                    factorType: 'totp',
                    // issuer: 'XFitness-Admin', // Optional: Customize issuer name
                    // friendlyName: `Admin TOTP ${session.user.email}` // Optional: Customize friendly name
                });
                if (enrollError) throw enrollError;
                // Important: Return the secret and QR code for the user to scan
                return NextResponse.json({
                    id: enrollData.id,
                    secret: enrollData.totp.secret,
                    qr_code: enrollData.totp.qr_code, // This is a data URL (e.g., "data:image/svg+xml;base64,...")
                    uri: enrollData.totp.uri // otpauth:// URI
                });

            // --- Action: Create Challenge (needed before verify/unenroll) ---
            case 'challenge':
                if (!factorId) return NextResponse.json({ error: 'factorId is required for challenge' }, { status: 400 });
                const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
                if (challengeError) throw challengeError;
                return NextResponse.json({ id: challengeData.id, expires_at: challengeData.expiresAt }); // Return challenge ID

            // --- Action: Verify TOTP Code (completes enrollment or login step) ---
            case 'verify':
                if (!factorId || !challengeId || !code) {
                    return NextResponse.json({ error: 'factorId, challengeId, and code are required for verify' }, { status: 400 });
                }
                const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
                if (verifyError) throw verifyError;
                // Optional: Check if factor status is now 'verified' - may need another listFactors call
                return NextResponse.json({ success: true, factorId: verifyData.id }); // verifyData doesn't contain much useful info

             // --- Action: Unenroll Factor ---
             case 'unenroll':
                 if (!factorId) return NextResponse.json({ error: 'factorId is required for unenroll' }, { status: 400 });
                 // Note: Unenrolling often doesn't require challenge/verify, but check Supabase docs if needed.
                 const { data: unenrollData, error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
                 if (unenrollError) throw unenrollError;
                 return NextResponse.json({ success: true, factorId: unenrollData.id }); // unenrollData just contains the id

            default:
                return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
        }
    } catch (error: any) {
        console.error(`MFA POST Error (Action: ${action}):`, error);
        // Provide more specific errors if possible (e.g., invalid code)
        let status = 500;
        let message = error.message || 'MFA action failed';
        if (error.message.includes('Invalid TOTP code') || error.message.includes('verification challenge has expired')) {
            status = 400; // Bad request for invalid code/challenge
        } else if (error.message.includes('Factor not found')) {
            status = 404;
        }
        return NextResponse.json({ error: message }, { status });
    }
}