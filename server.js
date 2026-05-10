import initApp from "./src/initApp.js";
import ngrok from "@ngrok/ngrok"; // 1. Import ngrok
import logger from "./src/utils/logger.js";

const port = process.env.PORT || 2000;

const app = await initApp();

app.listen(port, async () => {
  logger.info(`Server Started Successfully at PORT: ${port}`);
  // 2. Ngrok Tunnel Logic
  try {
    const session = await ngrok.connect({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    logger.info(`🌐 Public URL: ${session.url()}/handShake/webhook`);
    // console.log("Ise Meta Dashboard ke 'Callback URL' mein copy-paste karo.");
  } catch (err) {
    logger.info(`Ngrok Error:`, { error: err });
  }
});
