import rewrite from "./rewrite.mjs";

const word = {
    original: String,
    AS: String,
    IPA: String
};

const returnObject = {
    hasOverlap: Boolean,
    overlapping: [String],
    missing: [String]
}

export default function compare(inputObject){

    const allWords = (inputObject.text1.split(/[\s\n,-]+/g)
    .concat(inputObject.text2.split(/[\s\n,-]+/g)));

    return compareWordsFormatted(
        formatWords(inputObject.text1),
        formatWords(inputObject.text2),
        ...new Set(allWords)
    );
}

function formatWords(words){
    const splitWords = [];
    splitWords = words.split(/[\s\n,-]+/g)

    rewrite(words).split(' ').forEach((phonetic, index) => {
        words.push({
            original: splitWords[index],
            AS: phonetic.AS,
            IPA: phonetic.IPA
        });
    });
    return words;
}

function compareWordsFormatted(words1, words2, allWords) {
    const _overlapping = [];
    let _missing = [...allWords];
    let _hasOverlap = false;

    words1.forEach(word1 => {
        words2.forEach(word2 => {
            if (word1.AS == word2.AS && word1.IPA == word2.IPA) {
                _overlapping.push(word1.original);
                _missing = _missing.filter(word => word !== word1.original);
                _hasOverlap = true;
            }
        });
    });

    return {
        hasOverlap: _hasOverlap,
        overlapping: _overlapping,
        missing: _missing
    };
}

