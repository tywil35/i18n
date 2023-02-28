export interface i18nOption {
    numberOf: number;
    contextKey?: string;
    contextMatch?: string;
    data?: any;
}
export type LangFile = Record<'values' | 'contexts' | string, Record<string, string | any>>;
export type i18nValues = Record<string, string>;
export class i18n {
    dictionary: LangFile | undefined = undefined;
    silent: boolean | undefined = undefined;
    constructor(json: LangFile, silent: boolean = true) {
        this.dictionary = json;
        this.silent = silent;
    }

    private handleError(show: string, error: string): string {
        if (!this.silent) {
            throw error;
        }
        return show;
    }

    changeLocale(json: LangFile) {
        this.dictionary = json
    }

    t(key: string, options?: i18nOption) {
        if (!this.dictionary) return key;
        let value = this.findKey(key, options);
        if (options) {
            const isPlural = options.numberOf != undefined;
            const formatWithData = options.data != undefined;
            if (isPlural) {
                value = this.formatNumber(value, options.numberOf)
            }
            if (formatWithData) {
                value = this.format(value, options.data)
            }
        }
        return value;
    }

    private getDictionaryValues() {
        if (!this.dictionary) return undefined;
        return this.dictionary.values;
    }

    private getDictionaryContexts() {
        if (!this.dictionary) return undefined;
        return this.dictionary.contexts;
    }

    private formatNumber(text: string, num: number) {
        const regex = new RegExp(`\%n`, 'gm')
        text = text.replace(regex, Math.abs(num).toString())
        return text;
    }

    private format(text: string, data: any) {
        const keys = Object.keys(data);
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const regex = new RegExp(`\%({[^{]*?)${key}(?=\})}`, 'gm')
            text = text.replace(regex, data[key])
        }
        return text;
    }

    private findKey(key: string, options?: i18nOption) {
        const values = this.getDictionaryValues();
        const contexts = this.getDictionaryContexts();
        if (options) {
            const isContextual = options.contextKey != undefined && options.contextMatch != undefined;
            if (isContextual) {
                if (contexts === undefined) {
                    return this.handleError(key, 'No i18n values found');
                }
                for (let index = 0; index < contexts.length; index++) {
                    const element = contexts[index];
                    const _context_key = options.contextKey ?? '';
                    const match = element['matches'][_context_key];
                    if (match === options.contextMatch) {
                        const context_values = element['values'];
                        return this.processValues(key, context_values, options);
                    }
                }
                return key
            }
        }
        if (values === undefined) {
            return this.handleError(key, 'No i18n values found');
        }
        return this.processValues(key, values, options);
    }

    private processValues(key: string, values: i18nValues, options?: i18nOption) {
        const value = values[key];
        if (!value) return key;
        if (!Array.isArray(value)) {
            return value;
        }
        for (let index = 0; index < value.length; index++) {
            const plural = value[index];
            if (!plural || !Array.isArray(plural) || plural.length !== 3) {
                return this.handleError(key, `invalid plural property found for key ${key}`);
            };
            const check = options?.numberOf ?? 0;
            const min = plural[0];
            const max = plural[1];
            const result = plural[2];
            const bigEnough = min == undefined || (check >= min)
            const smallEnough = max == undefined || (check <= max)
            if (bigEnough && smallEnough) {
                return result;
            }
        }
        return key;
    }

}
