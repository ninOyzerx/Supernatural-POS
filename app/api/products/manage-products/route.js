import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT product_name, product_code, price, stock_quantity FROM products');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.error();
  }
}
