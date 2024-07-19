import format_AS from './formats/AS.mjs';
import format_IPA from './formats/IPA.mjs';
import letters from './formats/alfabet.mjs';

const alphabet = letters.all;
const vowelsArray = letters.vowels;
const consonantsArray = alphabet.filter((letter) => !vowelsArray.includes(letter));
const voicelessArray = letters.voiceless;

// wyjątki z dźwięcznością głosek przy spółgłoskach
export function sonority(word, a, b) {
    consonantsArray.some((con1) => {
        consonantsArray.some((con2) => {
            if (word.includes(con1 + a + con2))
                word = word.replace(con1 + a + con2, con1 + b + con2);
        });
        if (word.endsWith(con1 + a))
            word = word.replace(con1 + a, con1 + b);
    });
    return word;
}
// zmiana alfabetu dla danego systemu zapisu
export function updateAlphabet(array, key, value) {
    if (array.includes(key) && !array.includes(value))
        array.push(value);
}
// zamiana głoski na miększą zgodnie z zasadą gramatyki
export function makeSofter(word, array, softer) {
    let position = 0;
    const x = word.split("");
    for (let i = 0; i < x.length; i++) {
        if (Object.keys(softer).includes(x[i])) {
            position = i;
            break;
        }
    }
    const forDeletion = ["g", "h", "k"];
    const newSofts = array.filter((x) => !forDeletion.includes(x));
    newSofts.some((soft1) => {
        newSofts.some((soft2) => {
            if ((x[position - 2] + x[position - 1] === soft1 ||
                x[position - 1] === soft1) &&
                (x[position + 1] === soft2 ||
                    x[position + 1] + x[position + 2] === soft2)) {
                Object.keys(softer).forEach((key) => {
                    word = word.replace(soft1 + key + soft2, soft1 + softer[key] + soft2);
                });
            }
        });
    });
    return word;
}
// dodawanie zapisu akcentów w szczególnych przypadkach
export function vowelsAccent(word, a, b) {
    word = word.replace(a + "m", b + "m");
    word = word.replace(a + "n", b + "n");
    word = word.replace(a + "ŋ", b + "ŋ");
    word = word.replace(a + "ń", b + "ń");
    word = word.replace(a + "ɲ", b + "ɲ");
    word = word.replace(a + "j̃", b + "j̃");
    word = word.replace(a + "ĩ ̯", b + "ĩ ̯");
    return word;
}
// zmiękczanie wyjątków
export function specialSofter(word, a, b) {
    voicelessArray.some((voiceless) => {
        word = word.replace(a + voiceless, b + voiceless);
    });
    if (word.endsWith(a))
        word = word.replace(a, b);
    return word;
}
// redukcja powtórzeń liter
export function reduceRepeat(word) {
    const splitted = word.split("");
    for (let i = 0; i < splitted.length; i++) {
        if (splitted[i] === splitted[i - 1])
            splitted[i] = "•";
    }
    word = splitted.join("");
    return word;
}
// zwracanie obiektu z danymi
export default function rewrite(input) {
    const words = input.toLowerCase().split(/[\s\n,-]+/g);
    const results = {
        AS: "",
        IPA: ""
    };

    words.forEach((word) => {
        results.AS += format_AS(word) + " ";
        results.IPA += format_IPA(word) + " ";
    });

    results.AS = results.AS.trim();
    results.IPA = results.IPA.trim();
    
    console.log(results);
    return results;
}
