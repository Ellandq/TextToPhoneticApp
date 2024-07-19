import rewrite from "./rewrite.js";
import logger from './logger.js';

const word = {
    original: String,
    AS: String,
    IPA: String
};

const returnObject = {
    hasOverlap: Boolean,
    overlapping: [String],
    missing: [String]
};

export default function compare(inputObject) {
    logger.info(inputObject);

    const allWords = [...new Set(
        inputObject.text1.split(/[\s\n,-]+/g)
        .concat(inputObject.text2.split(/[\s\n,-]+/g))
    )];

    return compareWordsFormatted(
        formatWords(inputObject.text1),
        formatWords(inputObject.text2),
        allWords
    );
}

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

function compareWordsFormatted(words1, words2, allWords) {
    let _overlapping = [];
    let _missing = [...allWords];
    let _hasOverlap = false;

    words1.forEach(word1 => {
        words2.forEach(word2 => {
            if (word1.AS === word2.AS && word1.IPA === word2.IPA) {
                _overlapping.push(word1.original);
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
