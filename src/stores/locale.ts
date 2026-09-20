import { defineStore } from "pinia";
import { Lang } from "quasar";
import { i18n } from "src/i18n";

export type Locale = "fr-FR" | "en-US" | "de-DE";

import quasarFr from "quasar/lang/fr";
import quasarEn from "quasar/lang/en-US";
import quasarDe from "quasar/lang/de-DE";

const quasarLangs = {
    "fr-FR": quasarFr,
    "en-US": quasarEn,
    "de-DE": quasarDe,
};

export const useLocaleStore = defineStore("locale", {
    state: () => ({
        locale: "fr-FR" as Locale,
    }),

    actions: {
        setLocale(locale: Locale) {
            this.locale = locale;

            i18n.global.locale = locale;

            Lang.set(quasarLangs[locale]);

            localStorage.setItem("locale", locale);
        },

        initLocale() {
            const locale = (localStorage.getItem("locale") as Locale | null) || "fr-FR";

            this.setLocale(locale);
        },
    },
});
