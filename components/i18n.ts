type Substitutions = string | string[];
type NativeI18n = {
    getMessage(messageName: string, substitutions?: Substitutions): string;
    getUILanguage(): string;
};

function getI18n(): NativeI18n | undefined {
    return typeof browser === 'undefined' ? undefined : (browser.i18n as NativeI18n);
}

export function getLocale(): 'en' | 'ja' {
    const language = getI18n()?.getUILanguage().toLowerCase();

    return language?.startsWith('ja') ? 'ja' : 'en';
}

export function t(key: string, substitutions?: Substitutions): string {
    return getI18n()?.getMessage(key, substitutions) || key;
}
