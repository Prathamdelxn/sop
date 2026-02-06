import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is for password reset
    if (decoded.purpose !== 'password_reset') {
      return NextResponse.json(
        { message: 'Invalid token purpose' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      email: decoded.email 
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 400 }
    );
  }
}