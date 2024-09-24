import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT name, description, category_img FROM categories');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.error();
  }
}
