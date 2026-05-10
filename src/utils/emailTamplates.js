/**
 * 1. HOT LEAD ALERT TEMPLATE
 * Color: Amber (#FF9F00) - For Urgency
 */
export const hotLeadTemplate = (name, phone, interest, extractedData) => {
  const factsHtml =
    extractedData?.length > 0
      ? extractedData
          .map(
            (fact) => `<li style="margin-bottom: 8px;"><b>•</b> ${fact}</li>`,
          )
          .join("")
      : "<li>No specific facts extracted.</li>";

  return `
    <div style="font-family: sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border-top: 6px solid #FF9F00; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="padding: 30px;">
          <p style="text-transform: uppercase; letter-spacing: 2px; color: #FF9F00; font-weight: bold; margin: 0 0 10px 0;">New Opportunity</p>
          <h1 style="color: #1A1A1A; margin: 0 0 20px 0; font-size: 24px;">High-Intent Lead Detected</h1>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            A lead is showing strong interest in <b>${interest}</b>. Time to follow up!
          </p>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #1A1A1A; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px;">KEY DETAILS</p>
            <ul style="list-style: none; padding: 0; color: #444; font-size: 15px;">
              ${factsHtml}
            </ul>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding-bottom: 10px; color: #777;">Name:</td>
              <td style="padding-bottom: 10px; font-weight: bold; color: #1A1A1A;">${name || "Anonymous User"}</td>
            </tr>
            <tr>
              <td style="color: #777;">Phone:</td>
              <td style="font-weight: bold;"><a href="tel:${phone}" style="color: #FF9F00; text-decoration: none;">${phone}</a></td>
            </tr>
          </table>

          <div style="margin-top: 35px; text-align: center;">
            <a href="https://wa.me/${phone}" style="background: #FF9F00; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">REPLY ON WHATSAPP</a>
          </div>
        </div>
        <div style="background: #1A1A1A; color: #777; padding: 20px; text-align: center; font-size: 12px;">
          Sent by Korexbase AI • High-Intent Alert Layer
        </div>
      </div>
    </div>
  `;
};

/**
 * 2. DEAL CLOSED TEMPLATE
 * Color: Emerald (#00C853) - For Success
 */
export const closedDealTemplate = (
  name,
  phone,
  interest,
  extractedData,
  stage,
) => {
  const factsHtml =
    extractedData?.length > 0
      ? extractedData
          .map(
            (fact) => `<li style="margin-bottom: 8px;"><b>✓</b> ${fact}</li>`,
          )
          .join("")
      : "<li>Final details confirmed.</li>";

  return `
    <div style="font-family: sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border-top: 6px solid #00C853; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="padding: 30px;">
          <p style="text-transform: uppercase; letter-spacing: 2px; color: #00C853; font-weight: bold; margin: 0 0 10px 0;">Goal Reached</p>
          <h1 style="color: #1A1A1A; margin: 0 0 20px 0; font-size: 24px;">Deal Secured!</h1>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Excellent news! <b>${name || phone}</b> has confirmed their intent for <b>${interest}</b>.
          </p>

          <div style="background: #e8f9ef; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c8e6c9;">
            <p style="margin: 0 0 10px 0; color: #2e7d32; font-weight: bold;">FINAL SUMMARY</p>
            <ul style="list-style: none; padding: 0; color: #2e7d32; font-size: 15px;">
              ${factsHtml}
              <li><b>•</b> Stage: ${stage}</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 35px;">
            <p style="color: #777; font-size: 14px; margin-bottom: 15px;">Lead is waiting for the final quote.</p>
            <a href="tel:${phone}" style="background: #1A1A1A; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">CALL CLIENT NOW</a>
          </div>
        </div>
        <div style="background: #00C853; color: #ffffff; padding: 15px; text-align: center; font-size: 12px; font-weight: bold;">
          Korexbase AI: Mission Accomplished
        </div>
      </div>
    </div>
  `;
};

/**
 * 3. SECURE VERIFICATION TEMPLATE
 * Color: Emerald Green (#10B981) - For Security & Trust
 */
export const secureOtpTemplate = (code) => {
  return `
    <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 50px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header Strip -->
        <div style="background-color: #10B981; padding: 12px; text-align: center;">
          <span style="color: #ffffff; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
            Secure Access Control
          </span>
        </div>

        <div style="padding: 40px 35px; text-align: center;">
          <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px; font-weight: 800;">Verification Required</h2>
          
          <p style="color: #64748b; line-height: 1.6; font-size: 15px; margin-bottom: 30px;">
            To complete your request on <b>Korexbase</b>, please use the following one-time verification code.
          </p>

          <!-- Code Box -->
          <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <span style="font-family: monospace; font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #065f46;">
              ${code}
            </span>
          </div>

          <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #f1f5f9;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              This code is valid for <b>5 mins</b>.<br>
              If you did not initiate this request, please secure your account.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px; border-top: 1px solid #f1f5f9;">
          &copy; 2026 Korexbase AI Infrastructure. All rights reserved.
        </div>
      </div>
    </div>
  `;
};