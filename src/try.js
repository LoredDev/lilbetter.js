/* eslint-disable no-secrets/no-secrets */

/**
 * @typedef {[Error, undefined] | [null, R]} WrappedResult<R>
 * @template R
 */

/**
 * @template {(...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>} F
 * @param {F} func - The function to be executed.
 * @returns {(...args: Parameters<F>) => Promise<WrappedResult<Awaited<ReturnType<F>>>>}
 */
function tryAsync(func) {
	/**
	 * @param {Parameters<F>} args - The arguments of the function.
	 * @returns {Promise<WrappedResult<Awaited<ReturnType<F>>>>}
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
 * @template {(...args: Parameters<F>) => ReturnType<F>} F
 * @param {F} func - The function to be executed.
 * @returns {(...args: Parameters<F>) => WrappedResult<ReturnType<F>>}
 */
function trySync(func) {
	/**
	 * @param {Parameters<F>} args - The arguments of the function.
	 * @returns {WrappedResult<ReturnType<F>>}
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

