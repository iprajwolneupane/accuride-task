"use client";

import { useTranslation } from "react-i18next";

export default function LocaleText({ tag }: { tag: string }) {

    const { t } = useTranslation();

    return (
        <>{t(tag)}</>
    )
}