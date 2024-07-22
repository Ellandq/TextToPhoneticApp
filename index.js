import express from 'express';
import bodyParser from 'body-parser';
import rewrite from './rewrite.js';
import { compare,  isContained,  isExactMatch } from './compare.js';
import logger from './logger.js';

/*
    This api has multiple endpoints which return either a set object or 
    a boolean value.

    For the simple parser to AS and IPA format the input should look like this:

    {
        "text": "sample text"
    }

    For other endpoints the input should look like this:

    {
        "input":
        {
            "text1": "sample text 1",
            "text2": "sample text 2"
        }
    }
*/



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


app.post('/contains', (req, res) => {
    const { input } = req.body;
    if (!input || !input.text1 || !input.text2) {
        return res.status(400).send('Input is required and should contain text1 and text2');
    }

    try {
        const inputObject = {
            text1: input.text1,
            text2: input.text2
        };

        const result = isContained(inputObject);
        res.json({ result });
    } catch (error) {
        res.status(500).send('Error processing text.' + error);
    }
});

app.post('/exact-match', (req, res) => {
    const { input } = req.body;
    if (!input || !input.text1 || !input.text2) {
        return res.status(400).send('Input is required and should contain text1 and text2');
    }

    try {
        const inputObject = {
            text1: input.text1,
            text2: input.text2
        };

        const result = isExactMatch(inputObject);
        res.json({ result });
    } catch (error) {
        res.status(500).send('Error processing text.' + error);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
