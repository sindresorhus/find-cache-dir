export type Options = {
	/**
	Should be the same as your project name in `package.json`.
	*/
	readonly name: string;

	/**
	An array of files that will be searched for a common parent directory. This
	common parent directory will be used in lieu of the `cwd` option below.
	*/
	readonly files?: string[] | string;

	/**
	Directory to start searching for a `package.json` from.

	@default process.cwd()
	*/
	readonly cwd?: string;

	/**
	If `true`, the directory will be created synchronously before returning.

	@default false
	*/
	readonly create?: boolean;

	/**
	If `true`, this modifies the return type to be a function that is a thunk for
	`path.join(theFoundCacheDirectory)`.

	@default false
	*/
	readonly thunk?: boolean;
};

/**
Finds the cache directory using the supplied options. The algorithm checks for
the `CACHE_DIR` environmental variable and uses it if it is not set to `true`,
`false`, `1` or `0`. If one is not found, it tries to find a `package.json`
file, searching every parent directory of the `cwd` specified (or implied from
other options). It returns a `string` containing the absolute path to the cache
directory, or `undefined` if `package.json` was never found or if the
`node_modules` directory is unwritable.
*/
export default function findCacheDirectory(
	options: Options,
): string | undefined;
