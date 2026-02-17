
import 'server-only';

const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    // @ts-ignore
    return dictionaries[locale]?.() ?? dictionaries.en();
};
