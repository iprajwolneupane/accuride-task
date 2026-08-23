"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CommonError({ reset }: { reset: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100%-66px)] gap-4">
      <Image src="/images/sorry.gif" width={500} height={500} alt="Error illustration" />
      <h2 className="font-semibold text-lg">{t("message.errorGeneric")}</h2>
      <button
        onClick={reset}
        className="text-sm underline text-primary cursor-pointer hover:opacity-80 transition-opacity"
      >
        {t("common.tryAgain")}
      </button>
    </div>
  );
}
