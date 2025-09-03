//Importando o app.js
import app from './src/app.js';
const port = 8080;

//Servidor escutando a porta
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});