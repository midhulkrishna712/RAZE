const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const { name, age, location, email, grievance, dateTime } = data;

        // Basic validation
        if (!name || !email || !grievance) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Missing required fields.' })
            };
        }

        // Create Gmail SMTP transporter using environment variables from Netlify
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: `"Raze Signal Fire 🔥" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `🔥 New Help Request from ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0e15; border-radius: 16px; overflow: hidden; border: 1px solid #2a2d3e;">
                    <div style="background: linear-gradient(135deg, #ff4500, #ff2a00); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🔥 Raze Signal Fire</h1>
                        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">A new help request has been received</p>
                    </div>
                    <div style="padding: 30px; color: #e0e0e0;">
                        <h2 style="color: #ff4500; font-size: 18px; margin-bottom: 16px; border-bottom: 1px solid #2a2d3e; padding-bottom: 10px;">
                            📋 Visitor Details
                        </h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                            <tr>
                                <td style="padding: 10px 12px; color: #999; font-size: 13px; width: 120px;">Name</td>
                                <td style="padding: 10px 12px; color: #fff; font-weight: 600;">${name}</td>
                            </tr>
                            <tr style="background: rgba(255,255,255,0.03);">
                                <td style="padding: 10px 12px; color: #999; font-size: 13px;">Age</td>
                                <td style="padding: 10px 12px; color: #fff; font-weight: 600;">${age || 'Not provided'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 12px; color: #999; font-size: 13px;">Location</td>
                                <td style="padding: 10px 12px; color: #fff; font-weight: 600;">${location || 'Not provided'}</td>
                            </tr>
                            <tr style="background: rgba(255,255,255,0.03);">
                                <td style="padding: 10px 12px; color: #999; font-size: 13px;">Email</td>
                                <td style="padding: 10px 12px; color: #fff; font-weight: 600;">
                                    <a href="mailto:${email}" style="color: #ff7340; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 12px; color: #999; font-size: 13px;">Date/Time</td>
                                <td style="padding: 10px 12px; color: #fff; font-weight: 600;">${dateTime}</td>
                            </tr>
                        </table>
                        <h2 style="color: #ff4500; font-size: 18px; margin-bottom: 16px; border-bottom: 1px solid #2a2d3e; padding-bottom: 10px;">
                            ⚡ Problem Reported
                        </h2>
                        <div style="background: rgba(255, 69, 0, 0.08); border: 1px solid rgba(255, 69, 0, 0.2); border-radius: 12px; padding: 20px; color: #e0e0e0; line-height: 1.7; font-size: 15px;">
                            ${grievance}
                        </div>
                    </div>
                    <div style="padding: 20px 30px; text-align: center; border-top: 1px solid #2a2d3e;">
                        <p style="color: #666; font-size: 12px; margin: 0;">
                            Sent via Raze Signal Fire • The Guardian of the Livings
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Email sent successfully!' })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Failed to send email.' })
        };
    }
};
