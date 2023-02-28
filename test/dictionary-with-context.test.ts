import * as i18n from '../src';
const languageJSON = {
    "values": {
        "Yes": "Yebo",
        "No": "Nooooo",
        "Ok": "Ok",
        "Cancel": "Cancelled",
        "Due in %n days": [
            [null, -2, "Due -%n days ago"],
            [-1, -1, "Due Yesterday"],
            [0, 0, "Due Today"],
            [1, 1, "Due Tomorrow"],
            [2, null, "Due in %n days"]
        ]
    },
    "contexts": [
        {
            "matches": {
                "gender": "male"
            },
            "values": {
                "%{name}, they are %n y/o":
                    "%{name}, he is %n y/o"
            }
        },
        {
            "matches": {
                "gender": "female"
            },
            "values": {
                "%{name}, they are %n y/o":
                    "%{name}, she is %n y/o"
            }
        }
    ]
}
const options = {
    numberOf: 21,
    contextKey: 'gender',
    contextMatch: 'female',
    data: { name: 'Lee-Ann' }
}

const key = '%{name}, they are %n y/o';
const translate = new i18n.i18n(languageJSON);

describe('Dictionary with context', () => {
    test(`is ${key} translated with options ${JSON.stringify(options)}`, () => {
        console.time('My awesome performance test!');
        const _translation = translate.t(key, options);
        expect(_translation).toBe('Lee-Ann, she is 21 y/o');
        console.timeEnd('My awesome performance test!');
        console.log(`Translated Key => "${key}"  is "${_translation}"`);
    });
});