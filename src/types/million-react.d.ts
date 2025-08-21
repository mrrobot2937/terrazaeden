declare module 'million/react' {
    import type { ComponentType } from 'react'
    export function block<P = Record<string, unknown>>(component: ComponentType<P>): ComponentType<P>
    const _default: unknown
    export default _default
}


