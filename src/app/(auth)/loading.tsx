import Header from "@/components/shared/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            <Header>
                <h2 className="font-semibold">Active Todos</h2>
                <p className="text-xs text-gray-600">Manage your pending tasks and todos.</p>
            </Header>
            <div className="p-4 space-y-4">
                <Skeleton className="h-8 w-70" />
                <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <Skeleton key={index} className="h-40 w-full" />
                    ))}
                </div>
            </div>
        </>
    );
}