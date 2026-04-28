export const whatsappHandShake = async (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Check karo ki Meta wahi token bhej raha hai jo tumne .env mein dala hai
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log("Webhook Verified! Handshake Successful.");
      return res.status(200).send(challenge); // Meta ko challenge waapis bhejna zaroori hai
    } else {
      console.log("Verification Failed. Tokens don't match.");
      return res.sendStatus(403);
    }
  } catch (e) {
    console.log("Verification Failed. Tokens don't match. ERROR: "+e.message);
    return res.sendStatus(403);
  }
};
