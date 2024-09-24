import db from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { amount, paymentMethod, change, transactionId, items } = await request.json();

  // Check for missing fields
  if (!amount || !paymentMethod || change === undefined || !transactionId || !items) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
  }

  try {
      const [result] = await db.execute(
          `INSERT INTO payments (paid_amount, payment_method, \`change\`, transaction_id, items, created_at) 
          VALUES (?, ?, ?, ?, ?, NOW())`,
          [amount, paymentMethod, change, transactionId, JSON.stringify(items)]
      );

      return NextResponse.json({ message: 'Payment recorded', paymentId: result.insertId }, { status: 201 });
  } catch (error) {
      console.error('Error recording payment:', error.message);
      return NextResponse.json({ error: 'Error recording payment' }, { status: 500 });
  }
}

