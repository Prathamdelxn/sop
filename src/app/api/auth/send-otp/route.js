import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

// Configure your email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    // In production, you would store this OTP in your database with an expiration time
    // For demo, we'll just send it via email

    // Send email
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>We received a request to reset your password. Use the following OTP to verify your identity:</p>
          <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // In a real app, you would:
    // 1. Store the OTP in your database with the user's email and expiration time
    // 2. Return a success response without the OTP (for security)

    return NextResponse.json({ 
      success: true,
      message: 'OTP sent successfully' 
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}