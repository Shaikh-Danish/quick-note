export const getEmailVerificationTemplate = (otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email address</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #f8fafc; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" style="width: 100%; max-width: 540px; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);">
          <!-- Premium Accent Header -->
          <tr>
            <td style="height: 4px; background: linear-gradient(to right, #4F46E5, #818CF8);"></td>
          </tr>
          
          <!-- Main Body Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <!-- Logo -->
                    <div style="margin-bottom: 32px; background: #EEF2FF; display: inline-block; padding: 12px 24px; border-radius: 12px;">
                      <h2 style="margin: 0; color: #4F46E5; font-weight: 800; font-size: 24px; letter-spacing: -0.05em;">Quick Note</h2>
                    </div>
                    
                    <h1 style="margin: 0 0 12px 0; font-size: 26px; line-height: 32px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">Verify your email</h1>
                    
                    <p style="margin: 0 0 40px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                      Thanks for signing up to Quick Note! Please use the following one-time password (OTP) to verify your email address and secure your account.
                    </p>
                    
                    <!-- OTP Code Block -->
                    <div style="background-color: #EEF2FF; border: 2px solid #E0E7FF; border-radius: 12px; padding: 32px; margin-bottom: 40px; text-align: center;">
                      <div style="font-size: 12px; font-weight: 700; color: #4338CA; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Your Verification Code</div>
                      <div style="font-family: 'SF Mono', 'Roboto Mono', 'Courier New', monospace; font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #4F46E5; margin: 0; padding-left: 12px;">${otp}</div>
                    </div>
                    
                    <!-- Security Information -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;">
                      <tr>
                        <td style="padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6;">
                          <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 20px; color: #374151; font-weight: 600;">Security Reminder</p>
                          <ul style="margin: 0; padding: 0 0 0 20px; font-size: 13px; line-height: 18px; color: #6b7280;">
                            <li style="margin-bottom: 4px;">This code is valid for <strong>10 minutes</strong>.</li>
                            <li style="margin-bottom: 4px;">Never share this code with anyone, including Quick Note support.</li>
                            <li>If you didn't create an account, you can safely ignore this email.</li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer Section -->
          <tr>
            <td style="padding: 32px 40px; background-color: #111827; text-align: center;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 12px; font-weight: 800; color: #818CF8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">Quick Note</p>
                    <p style="margin: 0; font-size: 12px; line-height: 16px; color: #9ca3af;">
                      Capture your thoughts, anytime, anywhere.
                    </p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                      <p style="margin: 0; font-size: 11px; color: #6b7280;">
                        &copy; ${new Date().getFullYear()} Quick Note.<br>
                        This is an automated message, please do not reply.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- External Footer Links -->
        <table role="presentation" style="width: 100%; max-width: 540px; border-collapse: collapse; border: 0; border-spacing: 0;">
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                <a href="#" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> &nbsp;&bull;&nbsp; 
                <a href="#" style="color: #4F46E5; text-decoration: none;">Support Center</a> &nbsp;&bull;&nbsp; 
                <a href="#" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
