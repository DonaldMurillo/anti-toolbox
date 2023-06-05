import { Observable } from "rxjs";


export type SafeType<T> = unknown extends (T extends infer S ? S : never) ? T : T extends infer S ? S : never
export type OptionalType<T> = unknown extends (T extends infer S ? S : undefined) ? T : T extends infer S ? S : undefined

export type TypeSafeCallBack<T> = (state: SafeType<T>) => SafeType<T>;


export type BaseSimpleSelectorsType<TState, FeatureName extends string> = { 
	[K in keyof TState & string as `select${Capitalize<K>}`]: Observable<TState[K]>;
} & {
	[K in FeatureName as `select${Capitalize<K>}State`]: Observable<TState>
}
