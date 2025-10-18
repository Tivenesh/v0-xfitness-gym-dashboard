// app/api/access-logs/ingress/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer'; // Use the SERVICE_ROLE client

const VALID_API_KEY = process.env.ACCESS_SYSTEM_API_KEY; // Store a secret key in your .env.local

export async function POST(request: Request) {
    // 1. Security Check (Example: API Key)
    const apiKey = request.headers.get('X-API-Key');
    if (!VALID_API_KEY || apiKey !== VALID_API_KEY) {
        console.warn('Invalid or missing API key for access log ingress.');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const logData = await request.json();

        // 2. Validate incoming data structure (basic example)
        if (!logData.userId || !logData.timestamp || !logData.status) {
            console.error('Invalid log data received:', logData);
            return NextResponse.json({ error: 'Invalid log data format' }, { status: 400 });
        }

        // 3. TODO: Process and save the data (Task 7)
        console.log('Received access log:', logData);
        // Example: await saveLogToSupabase(logData);

        return NextResponse.json({ message: 'Log received successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Error processing access log:', error);
        return NextResponse.json({ error: 'Failed to process log' }, { status: 500 });
    }
}

// Example function (implement Task 7 logic here or call it)
async function saveLogToSupabase(logData: any) {
    // Logic from Task 7 goes here
     const { error } = await supabaseServer
        .from('access_logs') // Assuming your table is named 'access_logs'
        .insert({
            member_identifier: logData.userId, // Map incoming data fields to your table columns
            entry_time: new Date(logData.timestamp).toISOString(),
            access_status: logData.status === 'success' ? 'Granted' : 'Denied', // Example mapping
            raw_data: logData // Optional: Store the full payload for debugging
         });

    if (error) {
        console.error('Supabase insert error:', error);
        throw error; // Let the main handler catch it
    }
    console.log('Log saved to Supabase for user:', logData.userId);
}