import * as i18n from '../src';
const languageJSON = {
    "values": {
        "yes": "Yebo"
    }
}
const key = 'yes';
const translate = new i18n.i18n(languageJSON);

describe('Basic Dictionary', () => {
    test(`is ${key} translated`, () => {
        const _translation = translate.t(key);
        expect(_translation).toBe('Yebo');
        console.log(`Translated Key => "${key}"  is "${_translation}"`);
    });
});