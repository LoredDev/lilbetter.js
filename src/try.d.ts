
/**
 * The WrappedResult type returned by the wrapped function in {@link trySync}
 * and {@link tryAsync}.
 *
 * **If a error occurred, the result is undefined**.
 * If there's not a error, error will be null and the result will be defined.
 */
type WrappedResult<R> = [Error, undefined] | [null, R];

/**
 * The returned function from {@link tryAsync}.
 *
 * @param  args - The arguments of the function.
 * - The arguments of the wrapped function.
 * @returns
 * - The final tuple containing the Error object (if one occured) and the resulting value.
 */
type WrappedAsyncFunction<F> = (...args: Parameters<F>) =>
Promise<WrappedResult<Awaited<ReturnType<F>>>>;

/**
 * Function-sugar/Syntax-sugar for handling functions that can throw errors. Wrapping then
 * into a try-catch block / "curried function" that returns a "tuple as array" of error and
 * value, which can be used for handling the error using a Go-like fashion. **This function
 * is for asynchronous operations,** for synchronous ones, see {@link trySync}.
 *
 * **If there's a error, the result is undefined**.
 * If there's not a error, error will be null and the result will be defined.
 *
 * @param func
 * - The function to be executed.
 * @returns
 * - The function to be immediately called with the wrapped function's arguments.
 * @example
 * const [error, res] = await tryAsync(fetch)("https://example.com");
 * if (error !== null) {
 *   // error handling...
 *   console.log(error);
 * }
 * // continue the logic...
 */
function tryAsync<
	F extends (...args: Parameters<F>) => (ReturnType<F> extends Promise
		? ReturnType<F>
		: Promise<ReturnType<F>>
	),
>(func: F): WrappedAsyncFunction<F>;

/**
 * The returned function from {@link trySync}.
 *
 * @param args
 * - The arguments of the wrapped function.
 * @returns
 * - The final tuple containing the Error object (if one occured) and the resulting value.
 */
type WrappedFunction<F> = (...args: Parameters<F>) =>
WrappedResult<ReturnType<F>>;

/**
 * Function-sugar/Syntax-sugar for handling functions that can throw errors. Wrapping then
 * into a try-catch block / "curried function" that returns a "tuple as array" of error and
 * value, which can be used for handling the error using a Go-like fashion. **This function
 * is for synchronous operations,** for asynchronous ones, see {@link tryAsync}.
 *
 * **If there's a error, the result is undefined**.
 * If there's not a error, error will be null and the result will be defined.
 *
 * @param func
 * - The function to be executed.
 * @returns
 * - The function to be immediately called with the wrapped function's arguments.
 * @example
 * const [error, json] = trySync(JSON.parse)('{ "hello": "world" }');
 * if (error !== null) {
 *   // error handling...
 *   console.log(error);
 * }
 * // continue the logic...
 */
function trySync<
	F extends (...args: Parameters<F>) => ReturnType<F>,
>(func: F): WrappedFunction<F>;

export {
	type WrappedAsyncFunction,
	type WrappedFunction,
	type WrappedResult,
	tryAsync as tryA,
	tryAsync,
	trySync as tryS,
	trySync,
};
