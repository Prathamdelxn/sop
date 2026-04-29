import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure email transporter using environment variables
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
    // Handle FormData for larger payloads
    const formData = await request.formData();
    const email = formData.get('email');
    const pdfFile = formData.get('pdf');
    const filename = formData.get('filename') || (pdfFile?.name) || 'report.pdf';
    const subject = formData.get('subject') || 'E-Logbook Report';

    if (!email || !pdfFile) {
      return NextResponse.json(
        { success: false, message: 'Email and PDF file are required' },
        { status: 400 }
      );
    }

    // Convert File/Blob to buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mailOptions = {
      from: `"E-Logbook Reports" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Report Generated</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; background-color: white;">
            <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">Please find the requested E-Logbook report attached to this email.</p>
            
            <div style="margin: 25px 0; padding: 20px; background-color: #f9fafb; border-radius: 12px; border-left: 4px solid #4f46e5;">
              <p style="margin: 0; font-weight: bold; color: #1f2937;">Report Details:</p>
              <p style="margin: 5px 0 0; color: #4b5563; font-size: 14px;">${filename}</p>
              <p style="margin: 5px 0 0; color: #4b5563; font-size: 14px;">Generated on: ${new Date().toLocaleString()}</p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              This is an automated report from the SOP Management System. Please do not reply directly to this email.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
            &copy; ${new Date().getFullYear()} SOP Management System. All rights reserved.
          </div>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: buffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending report email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
