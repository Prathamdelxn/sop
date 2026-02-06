import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import SuperAdmin from '@/model/SuperAdmin';
import SuperManager from '@/model/SuperManager';
import dbConnect from '@/utils/db';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  try {
    await dbConnect();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
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

    const { email } = decoded;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to update password in both collections
    let updatedUser = null;
    let userType = '';
    let username = '';

    // 1. Check in SuperAdmin collection
    updatedUser = await SuperAdmin.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (updatedUser) {
      userType = 'superAdmin';
      username = updatedUser.username;
    } else {
      // 2. If not found in SuperAdmin, check SuperManager
      updatedUser = await SuperManager.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
      if (updatedUser) {
        userType = 'superManager';
        username = updatedUser.username;
      }
    }

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found in admin or manager records' },
        { status: 404 }
      );
    }

    // Send email with credentials
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Password Has Been Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Successful</h2>
          <p>Your password has been successfully updated. Here are your new credentials:</p>
          
          <div style="background: #f3f4f6; padding: 16px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>New Password:</strong> ${password}</p>
          </div>
          
          <p style="color: #ef4444; font-weight: bold;">
            For security reasons, we recommend changing this password after logging in.
          </p>
          
          <p>You can now login to your ${userType === 'superAdmin' ? 'Admin' : 'Manager'} dashboard:</p>
          <a href="${process.env.NEXTAUTH_URL}/${userType === 'superAdmin' ? 'super-admin/login' : 'manager/login'}" 
             style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Go to Login Page
          </a>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            © ${new Date().getFullYear()} Your App Name. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true,
      message: 'Password reset successfully. Credentials sent to your email.',
      userType
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to reset password' },
      { status: 400 }
    );
  }
}