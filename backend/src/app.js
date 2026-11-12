import express from 'express';
import usuariosRouter from './routes/usuarios.js';
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//Registrar as rotas de usuários
app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
    console.log('Example app listening on port: ' + port);
})