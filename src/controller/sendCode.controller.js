import { values } from "../config/values.js";
import sendEmail from "../libs/emailService.js";
import { secureOtpTemplate } from "../utils/emailTamplates.js";
import { responseBody } from "../utils/responseBody.js";

export const sendCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res
        .status(400)
        .send(responseBody(400, false, false, "Payload not satisfied", {}));
    }
    // email found
    // 2. Make a Email bogy
    // 3. Send to mail
    const adminEmailOfOtp = values?.noReplyEmail;
    const adminName = values?.adminName;
    const emailBody = secureOtpTemplate(code);
    const subject = "One-Time Password (OTP) - " + values?.companyName;

    const isEmailSend = await sendEmail(
      adminEmailOfOtp,
      adminName,
      email,
      subject,
      "Korexbase Client",
      emailBody,
    );
    if (isEmailSend.success) {
      return res
        .status(200)
        .send(responseBody(200, false, true, "OTP send successfull", {}));
    }

    // Service failure
    return res
      .status(400)
      .send(responseBody(400, true, false, isEmailSend.message, {}));
  } catch (e) {
    return res
      .status(500)
      .send(responseBody(500, true, false, e.message || "Server Error", {}));
  }
};
