const express = require('express');
const app = express();
const port = 3000;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

app.post('/magica-categoria-lancamento', async (req, res) => {

    let body = req.body;
    let categorias = body.categorias;
    let mensagem = `Informe o ID da categoria em que o lançamento \"${body.nome}\" melhor se encaixa: \n\n`;

    for (const id in categorias) {
        const categoria = categorias[id];
        mensagem += `${id}: ${categoria.nome}\n`;
    }

    let completion = {
        model: "text-davinci-003",
        prompt: mensagem,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    };

    const response = await openai.createCompletion(completion);

    let categoriaId = parseInt(response.data.choices[0].text.replace(/\D/g, ""));

    res.json(categoriaId);

});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});