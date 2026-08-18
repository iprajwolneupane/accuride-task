"use client";
import CommonError from "@/components/shared/common-error";
import Header from "@/components/shared/header";

export default function Error({ reset }: {
    error: Error;
    reset: () => void
}) {
    return (
        <>
            <Header>
                <h2 className="font-semibold">Active Todos</h2>
                <p className="text-xs text-gray-600">Manage your pending tasks and todos.</p>
            </Header>
            <CommonError reset={reset} />
        </>
    );
}