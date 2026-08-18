"use client";
import Image from "next/image";

export default function CommonError({ reset }: {
    reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100%-66px)] gap-4">
            <Image src={"/images/sorry.gif"} width={500} height={500} alt="Feeling Sorry Avatar" />
            <h2 className="font-semibold text-lg">We're sorry, something went wrong</h2>
            <button
                onClick={reset}
                className="text-sm underline text-primary cursor-pointer"
            >
                Try again
            </button>
        </div>
    );
}