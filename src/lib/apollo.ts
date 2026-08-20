import { HYGRAPH_API_TOKEN, HYGRAPH_API_URL } from '@/constant';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
    uri: HYGRAPH_API_URL,
    headers: {
        Authorization: `Bearer ${HYGRAPH_API_TOKEN}`
    },
    fetchOptions: {
        cache: "no-store",
    },
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache"
        }
    }
})

export default client;