// File: /api/get-user/route.js
import db  from '../../lib/db'; // Adjust the path as necessary
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Get the session token from cookies (this assumes you're using cookies)
        const cookie = req.headers.get('cookie');
        const sessionToken = cookie?.split('session_token=')[1]?.split(';')[0]; // Extract the session token

        // Ensure the session token is available
        if (!sessionToken) {
            return NextResponse.json({ message: "จำเป็นต้องมีโทเค็นเซสชั่น" }, { status: 401 });
        }

        // Fetch user details based on the session token
        const [userResults] = await db.query('SELECT store_id FROM users WHERE session_token = ?', [sessionToken]);
        
        if (userResults.length === 0) {
            return NextResponse.json({ message: "ไม่พบผู้ใช้งาน" }, { status: 404 });
        }

        const userData = userResults[0];
        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
    }
}
