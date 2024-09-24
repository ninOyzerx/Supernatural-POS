import db from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader ? authHeader.replace('Bearer ', '') : '';

    if (!sessionToken) {
      return NextResponse.json({ message: 'Session Token not found' }, { status: 401 });
    }

    // Validate session token
    const [sessionResults] = await db.query('SELECT * FROM sessions WHERE session_token = ?', [sessionToken]);
    const session = sessionResults[0];
    if (!session) {
      return NextResponse.json({ message: 'Session Token ไม่ถูกต้องหรือหมดอายุ' }, { status: 401 });
    }

    const userId = session.user_id;
    
    const [userResults] = await db.query('SELECT store_id FROM users WHERE id = ?', [userId]);
    const user = userResults[0];
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const storeId = user.store_id;

    // Fetch store_name based on store_id
    const [storeResults] = await db.query('SELECT store_name FROM stores WHERE id = ?', [storeId]);
    const store = storeResults[0];
    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    // ส่ง storeId และ store_name กลับ
    return NextResponse.json({ storeId, store_name: store.store_name });
  } catch (error) {
    console.error('Error validating session:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
