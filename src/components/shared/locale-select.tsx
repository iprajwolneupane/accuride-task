"use client";
import i18next from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_LOCALE, LOCALE } from "@/constant";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function LocaleSelect() {
  const router = useRouter();

  const localeItems = useMemo(
    () => LOCALE.map((item) => ({ value: item.code, label: item.name })),
    []
  );

  const [currentLocale, setCurrentLocale] = useState<string>(() => {
    const saved = Cookies.get("locale") ?? DEFAULT_LOCALE;
    const exists = localeItems.some((item) => item.value === saved);
    return exists ? saved : DEFAULT_LOCALE;
  });

  const handleLocaleChange = useCallback((val: string | null) => {
    if (!val) return;
    setCurrentLocale(val);
    Cookies.set("locale", val, { expires: 365 });
    i18next.changeLanguage(val.split("_")[0]);
    router.refresh();
  }, []);

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-30">
        <SelectValue placeholder="Locale">
          {localeItems.find((item) => item.value === currentLocale)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {localeItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
