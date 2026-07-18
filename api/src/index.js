import express from 'express';
import cors from 'cors';
import router from './routers/index.js';
import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";

const app = express();
app.use(router);

// cors Configuration
const corsOptions = {
    origin: env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : '*',
};

app.use(cors(corsOptions));
app.use(express.json());

app.listen(env.PORT || 3000, () => {
  console.log(`Server is running on port ${env.PORT || 3000}`);
});

export default httpServerHandler({ port: 3000 });