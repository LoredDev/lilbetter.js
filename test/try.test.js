/* eslint-disable import/no-relative-parent-imports */
// eslint-disable-next-line n/no-unpublished-import
import { describe, it } from 'vitest';

import { tryA, tryS } from '../src/index.js';

describe.concurrent('Return values', () => {
	it('JSON parsing [Sync, Success]', ({ expect }) => {
		const [error, json] = tryS(JSON.parse)('{ "hello": "world" }');

		expect(error).toBe(null);
		expect(json).toEqual({ hello: 'world' });
	});
	it('JSON parsing [Sync, Error]', ({ expect }) => {
		const [error, json] = tryS(JSON.parse)('{ "hello: "world" }');

		expect(error?.name).toEqual('SyntaxError');
		expect(error).toBeInstanceOf(Error);
		expect(json).toBe(undefined);
	});
	it('Fetch function [Async, Success]', async ({ expect }) => {
		const [error, res] = await tryA(fetch)('https://example.com');

		expect(error).toBe(null);
		expect(res?.status).toBe(200);
	});
	it('Fetch function [Async, Error]', async ({ expect }) => {
		const [error, res] = await tryA(fetch)('htps://example.com');

		expect(error?.name).toEqual('TypeError');
		expect(error).toBeInstanceOf(Error);
		expect(res).toBe(undefined);
	});
});

