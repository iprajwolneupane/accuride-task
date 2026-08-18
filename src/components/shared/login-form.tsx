"use client";
import { useSignIn } from "@clerk/nextjs/legacy";
import { GithubLogo, GoogleIcon } from "@/components/shared/svg";
import { Button } from "@/components/ui/button";

export default function LoginForm() {

    const { signIn, isLoaded } = useSignIn();

    const signInWithGithub = () => {
        if (!isLoaded) return;
        signIn.authenticateWithRedirect({
            strategy: "oauth_github",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
        });
    };

    const signInWithGoogle = () => {
        if (!isLoaded) return;
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
        });
    };

    return (
        <div className="flex flex-col items-center gap-3 p-5 min-w-96 rounded-lg border bg-primary-foreground">
            <h1 className="font-semibold text-2xl">Accuride Tasks</h1>
            <p className="text-gray-600 text-sm">Sign in to manage your workflow</p>
            <Button onClick={() => signInWithGithub()} size={"lg"} className="w-full flex items-center gap-4 hover:bg-black text-white bg-gray-900 mt-4">
                <GithubLogo className="fill-white scale-150" />
                <p>Sign in with Github</p>
            </Button>
            <div className="flex items-center gap-4">
                <div className="h-px w-20 bg-border" />
                <p className="text-gray-600 text-sm">or</p>
                <div className="h-px w-20 bg-border" />
            </div>
            <Button onClick={() => signInWithGoogle()} size={"lg"} className="w-full flex items-center gap-4 text-white">
                <GoogleIcon className="fill-white scale-150" />
                <p>Sign in with Google</p>
            </Button>
        </div>
    )
}