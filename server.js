import initApp from "./src/initApp.js";

const port = process.env.PORT || 2000;

const app = await initApp();

app.listen(port,()=>{
    console.log(`Server Stated Successfully at PORT: ${port}`);
})
