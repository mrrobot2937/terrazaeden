export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql'

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store'
    })

    if (!res.ok) {
        throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`)
    }

    const json = await res.json() as { data?: T; errors?: Array<{ message: string }> }
    if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors.map(e => e.message).join(', '))
    }
    return json.data as T
} 