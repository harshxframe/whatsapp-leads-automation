import initApp from "./src/initApp.js";
import ngrok from "@ngrok/ngrok"; // 1. Import ngrok

const port = process.env.PORT || 2000;

const app = await initApp();

app.listen(port, async ()=>{
    console.log(`Server Stated Successfully at PORT: ${port}`);
    // 2. Ngrok Tunnel Logic
    try {
        const session = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTHTOKEN
        });

        console.log(`🌐 Public URL: ${session.url()}/handShake/webhook`);
       // console.log("Ise Meta Dashboard ke 'Callback URL' mein copy-paste karo.");
    } catch (err) {
        console.error("Ngrok Error:", err);
    }
})
