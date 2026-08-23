"use client";

import { GithubLogo, GoogleIcon } from "@/components/shared/svg";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { signIn, isLoaded } = useSignIn();
  const { t } = useTranslation();

  const handleOAuthSignIn = (strategy: "oauth_github" | "oauth_google") => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="flex flex-col items-center gap-3 p-5 min-w-96 rounded-lg border bg-primary-foreground">
      <h1 className="font-semibold text-2xl">{t("common.appTitle")}</h1>
      <p className="text-muted-foreground text-sm">{t("common.signIn")}</p>
      <Button
        onClick={() => handleOAuthSignIn("oauth_github")}
        size="lg"
        className="w-full flex items-center gap-4 hover:bg-black text-white bg-gray-900 mt-4"
      >
        <GithubLogo className="fill-white scale-150" />
        <span>{t("common.github")}</span>
      </Button>

      <div className="flex items-center gap-4 w-full justify-center">
        <div className="h-px flex-1 bg-border" />
        <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("common.or")}</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        onClick={() => handleOAuthSignIn("oauth_google")}
        size="lg"
        className="w-full flex items-center gap-4 text-white"
      >
        <GoogleIcon className="fill-white scale-150" />
        <span>{t("common.google")}</span>
      </Button>
    </div>
  );
}
