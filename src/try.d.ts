
type WrappedResult<R> = [Error, undefined] | [null, R];

function tryAsync<
	F extends (...args: Parameters<F>) => (ReturnType<F> extends Promise
		? ReturnType<F>
		: Promise<ReturnType<F>>
	),
>(func: F): (...args: Parameters<F>) =>
Promise<WrappedResult<Awaited<ReturnType<F>>>>;

function trySync<
	F extends (...args: Parameters<F>) => ReturnType<F>,
>(func: F): (...args: Parameters<F>) => WrappedResult<ReturnType<F>>;

export {
	tryAsync as tryA,
	tryAsync,
	trySync as tryS,
	trySync,
};
