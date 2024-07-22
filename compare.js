import rewrite from "./rewrite.js";
import logger from './logger.js';


const wordFormat = {
    original: String,
    AS: String,
    IPA: String
};

const returnObject = {
    hasOverlap: Boolean,
    overlapping: [String],
    missing: [String]
};

//This function compares two texts by converting them into phonetic formats and then determining which words overlap and which are missing.
export function compare(inputObject) {
    logger.info(`Is Compare call | Input Object: ${JSON.stringify(inputObject)}`)

    const allWords = [...new Set(
        inputObject.text1.split(/[\s\n,-]+/g)
        .concat(inputObject.text2.split(/[\s\n,-]+/g))
    )];
    
    const returnObject = compareWordsFormatted(
        formatWords(inputObject.text1),
        formatWords(inputObject.text2),
        allWords
    );

    logger.info(`Result: ${JSON.stringify(returnObject)}`)
    return returnObject;
}

//Checks whether all words from the first text are contained in the second text.
export function isContained(inputObject) {
    const wordSet1 = formatWords(inputObject.text1); 
    const wordSet2 = formatWords(inputObject.text2); 

    logger.info(`Is Contained call | Input Object: ${JSON.stringify(inputObject)} | WordSet1: ${JSON.stringify(wordSet1)} | WordSet2: ${JSON.stringify(wordSet2)}`)

    const wordSet2Set = new Set(wordSet2.map(word => `${word.AS}|${word.IPA}`));
    
    const allContained = wordSet1.every(word1 => {
        const wordKey = `${word1.AS}|${word1.IPA}`;
        const contained = wordSet2Set.has(wordKey);
        if (contained) {
            logger.info(`Contained Word: ${JSON.stringify(word1)}`);
        }
        return contained;
    });

    logger.info(`Result: ${allContained}`);
    return allContained;
}

// Checks if two texts are identical in terms of their phonetic representation. 
export function isExactMatch(inputObject) {
    const wordSet1 = formatWords(inputObject.text1); 
    const wordSet2 = formatWords(inputObject.text2); 

    logger.info(`Exact Match call | Input Object: ${JSON.stringify(inputObject)} | WordSet1: ${JSON.stringify(wordSet1)} | WordSet2: ${JSON.stringify(wordSet2)}`);

    if (wordSet1.length !== wordSet2.length) {
        logger.info("Result: false (different lengths)");
        return false;
    }

    const allMatch = wordSet1.every((word1, index) => {
        const word2 = wordSet2[index];
        return word1.AS === word2.AS && word1.IPA === word2.IPA;
    });

    logger.info(`Result: ${allMatch}`);
    return allMatch;
}

// Converts a text into phonetic formats. 
function formatWords(words) {
    const splitWords = words.split(/[\s\n,-]+/g);
    const converted = rewrite(words);

    let splitAS = converted.AS.split(' ');
    let splitIPA = converted.IPA.split(' ');
    let result = [];

    splitWords.forEach((word, index) => {
        result.push({
            original: word,
            AS: splitAS[index],
            IPA: splitIPA[index]
        });
    });

    return result;
}

// Compares formatted words from two sets to find overlapping and missing words. 
function compareWordsFormatted(words1, words2, allWords) {
    let _overlapping = [];
    let _missing = [...allWords];
    let _hasOverlap = false;

    words1.forEach(word1 => {
        words2.forEach(word2 => {
            if (word1.AS === word2.AS && word1.IPA === word2.IPA) {
                _overlapping.push(word2.original);
                _hasOverlap = true;
            }
        });
    });

    _missing = _missing.filter(word => !_overlapping.includes(word));

    return {
        hasOverlap: _hasOverlap,
        overlapping: Array.from(new Set(_overlapping)), 
        missing: _missing
    };
}
