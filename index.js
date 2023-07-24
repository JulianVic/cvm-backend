import express from 'express';
import clientaRoutes from  "./routes/clientaRoutes.js"
import coordinadorRoutes from  "./routes/coordinadorRoutes.js"
import avalRoutes from  "./routes/avalRoutes.js"
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.json());

const clientasRouter = clientaRoutes;
const coordinadorRouter = coordinadorRoutes;
const avalRouter = avalRoutes;

app.use("/api/clientas", clientasRouter);
app.use("/api/coordinadores", coordinadorRouter);
app.use("/api/avales", avalRouter);

const port = 3000

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
    }
) 