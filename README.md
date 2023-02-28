# i18n Translation Class
> author: [gwildev7](https://github.com/gwildev7)
>
> published: 6 Jan 23
>
> beverage: [buy me](https://github.com/gwildev7)

## Requirement
- Node 12+
- NPM 8+

## To install 
``` bash
npm install @cbana/i18n
```

## to use
> json can come from API or public resource
``` ts
import { i18n } from '@cbana/i18n';

// Create, Fetch or locate dictionary
const languageJSON = {
    "values": {
        "yes": "Yebo"
    }
}

// Create new class with json dictionary
// Note new i18n(languageJSON, silent /** false | undefined */) will throw any error and should be caught, by default errors are thrown
// in production it is recommended you set silent = true OR ommit the last parameter 
const translate = new i18n(languageJSON, false);

// Decided on key to fetch/translate
const key = 'yes';
try {
    const translated_string = translate.t(key);
    console.log(`Translated Key => "${key}"  is "${translated_string}"`);
    // Translated Key => "yes"  is "Yebo"
} catch (e) {
    console.warn(e);
}
```

## condition, context and values example
``` ts
/** Test Dictionary */
const languageFile = {
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

// new i18n(## typeof LangFile #)
const translate = new i18n(languageFile);

// set options when required, else it will return the key
const options = {
    numberOf: 21,
    contextKey: 'gender',
    contextMatch: 'female',
    data: { name: 'Lee-Ann' }
}

const key = '%{name}, they are %n y/o';
const answer = translate.t(key, options);

// if fail it will return the key
console.log(`Translated Key => "${key}"  is "${answer}"`);
// Translated Key => "%{name}, they are %n y/o"  is "Lee-Ann, she is 21 y/o"
```


## For Vue3 TS projects

1. Create new file in `src` directory `/plugin/i18n.ts`
2. inside of **i18n.ts** paste the following
```ts
import { i18n, type i18nOption } from "@cbana/i18n"
import type { App, Plugin } from "vue";

export const i18nPlugin: Plugin = {
    install: (app: App, json: any) => {
        const translateLang = (key: string, option?: i18nOption) => {
            const s = new i18n(json);
            return s.t(key, option);
        }
        app.config.globalProperties.$i18n = translateLang;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $i18n: (key: string, option?: i18nOption) => string;
    }
}
```
3. in `main.ts` of app add to `App.use(..)`
```ts
import { i18nPlugin } from './plugin/i18n';

const app = createApp(App);

app.use(i18nPlugin, '/lang.json');

app.mount();
```
4. implement in `.vue` components
```ts
        <div class="padded">
            {{ $i18n('%{name}, they are %n y/o', {
                    numberOf: 21,
                    contextKey: 'gender',
                    contextMatch: 'female',
                    data: { name: 'Lee-Ann' }
                })
            }}
        </div>
```

## Other Examples

```ts
const translator = new i18n({
    "values": {
        "Yes": "Yessss",
        "No": "Nooooo",
    },
});

translator.t('Yes');
```

```ts
translator.changeLocale({
    "values": {
        "Yes": "Ok",
        "No": "Nope",
    },
});

translator.t('Yes');
```

```ts
translator.changeLocale({
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
});

translator.t(
    '%{name}, they are %n y/o', {
    numberOf: 21,
    contextKey: 'gender',
    contextMatch: 'female',
    data: { name: 'Lee-Ann' }
});
```