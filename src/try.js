/* eslint-disable no-secrets/no-secrets */

/**
 * @typedef {[Error, undefined] | [null, R]} WrappedResult<R>
 * @template R
 */

/**
 * Function-sugar/Syntax-sugar for handling functions that can throw errors. Wrapping then
 * into a try-catch block / "curried function" that returns a "tuple as array" of error and
 * value, which can be used for handling the error using a Go-like fashion. **This function
 * is for asynchronous operations,** for synchronous ones, see {@link trySync}.
 *
 * **If there's a error, the result is undefined**.
 * If there's not a error, error will be null and the result will be defined.
 *
 * @template {(...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>} F
 * @param {F} func
 * - The function to be executed.
 * @returns {(...args: Parameters<F>) => Promise<WrappedResult<Awaited<ReturnType<F>>>>}
 * - The function to be immediately called with the wrapped function's arguments.
 * @example
 * const [error, res] = await tryAsync(fetch)("https://example.com");
 * if (error !== null) {
 *   // error handling...
 *   console.log(error);
 * }
 * // continue the logic...
 */
function tryAsync(func) {
	/**
	 * The returned function from {@link tryAsync}.
	 *
	 * @param {Parameters<F>} args - The arguments of the function.
	 * - The arguments of the wrapped function.
	 * @returns {Promise<WrappedResult<Awaited<ReturnType<F>>>>}
	 * - The final tuple containing the Error object (if one occured) and the resulting value.
	 */
	return async (...args) => {
		try {
			return [null, await func(...args)];
		}
		catch (error) {
			if (error instanceof Error) return [error, undefined];

			const errObj = new Error(error?.toString
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				? `Stringified error to: ${error.toString()}`
				: 'Could not stringify error',
			{ cause: { value: error } });

			return [errObj, undefined];
		}
	};
}

/**
 * Function-sugar/Syntax-sugar for handling functions that can throw errors. Wrapping then
 * into a try-catch block / "curried function" that returns a "tuple as array" of error and
 * value, which can be used for handling the error using a Go-like fashion. **This function
 * is for synchronous operations,** for asynchronous ones, see {@link tryAsync}.
 *
 * **If there's a error, the result is undefined**.
 * If there's not a error, error will be null and the result will be defined.
 *
 * @template {(...args: Parameters<F>) => ReturnType<F>} F
 * @param {F} func
 * - The function to be executed.
 * @returns {(...args: Parameters<F>) => WrappedResult<ReturnType<F>>}
 * - The function to be immediately called with the wrapped function's arguments.
 * @example
 * const [error, json] = trySync(JSON.parse)('{ "hello": "world" }');
 * if (error !== null) {
 *   // error handling...
 *   console.log(error);
 * }
 * // continue the logic...
 */
function trySync(func) {
	/**
	 * The returned function from {@link trySync}.
	 *
	 * @param {Parameters<F>} args
	 * - The arguments of the wrapped function.
	 * @returns {WrappedResult<ReturnType<F>>}
	 * - The final tuple containing the Error object (if one occured) and the resulting value.
	 */
	return (...args) => {
		try {
			return [null, func(...args)];
		}
		catch (error) {
			if (error instanceof Error) return [error, undefined];

			const errObj = new Error(error?.toString
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				? `Stringified error to: ${error.toString()}`
				: 'Could not stringify error',
			{ cause: { value: error } });

			return [errObj, undefined];
		}
	};
}

export {
	tryAsync as tryA,
	tryAsync,
	trySync as tryS,
	trySync,
};

