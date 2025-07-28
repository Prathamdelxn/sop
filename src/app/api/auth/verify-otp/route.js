import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // In a real app, you would:
    // 1. Retrieve the stored OTP from your database for this email
    // 2. Check if it matches and hasn't expired
    // 3. For demo, we'll assume the OTP is valid

    // Generate a password reset token (JWT)
    const resetToken = jwt.sign(
      { email, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );

    return NextResponse.json({ 
      success: true,
      token: resetToken 
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { message: 'Invalid OTP or OTP expired. Please try again.' },
      { status: 400 }
    );
  }
}