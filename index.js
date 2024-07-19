import express from 'express';
import bodyParser from 'body-parser';
import rewrite from './rewrite.js';
import compare from './compare.js';
import logger from './logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post('/convert', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send('Text is required');
    }


    try {
        const result = rewrite(text);
        res.json({ result });
    } catch (error) {
        res.status(500).send('Error processing text');
    }
});

app.post('/compare', (req, res) => {
    const { input } = req.body;
    if (!input || !input.text1 || !input.text2) {
        return res.status(400).send('Input is required and should contain text1 and text2');
    }

    try {
        const inputObject = {
            text1: input.text1,
            text2: input.text2
        };

        const result = compare(inputObject);
        res.json({ result });
    } catch (error) {
        res.status(500).send('Error processing text.' + error);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
