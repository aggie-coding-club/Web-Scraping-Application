export function assertIsDefined<T>(val: T, message: string = "Expected 'val' to be defined, but received " + val): asserts val is NonNullable<T> {
    if (!val || val === null || val === undefined) {
        throw new Error(message);
    }
}
