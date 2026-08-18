"use client";

import client from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client/react";

export default function ApolloClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}