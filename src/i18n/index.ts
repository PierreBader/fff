import { createI18n } from "vue-i18n";

import enUS from "./en-US";
import frFR from "./fr-FR";
import deDE from "./de-DE";

export const messages = {
    "en-US": enUS,
    "fr-FR": frFR,
    "de-DE": deDE,
};

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)["fr-FR"];

export const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    legacy: false,
    locale: "fr-FR",
    fallbackLocale: "en-US",
    globalInjection: true,
    messages,
});
