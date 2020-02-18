'use strict';
const path = require('path');
const fs = require('fs');
const commonDir = require('commondir');
const pkgDir = require('pkg-dir');
const makeDir = require('make-dir');

const isWritable = path => {
	try {
		fs.accessSync(path, fs.constants.W_OK);
		return true;
	} catch (_) {
		return false;
	}
};

function getNodeModuleDirectory(directory, name) {
	const nodeModules = path.join(directory, 'node_modules');
	if (
		!isWritable(nodeModules) &&
		(fs.existsSync(nodeModules) || !isWritable(path.join(directory)))
	) {
		return undefined;
	}

	return path.join(directory, 'node_modules', '.cache', name);
}

module.exports = (options = {}) => {
	const {name} = options;
	const cacheDir = process.env.CACHE_DIR;
	let directory = cacheDir ? path.join(cacheDir, 'find-cache-dir') : options.cwd || process.cwd();

	if (!cacheDir) {
		if (options.files) {
			directory = commonDir(directory, options.files);
		}

		directory = pkgDir.sync(directory);
	}

	if (directory) {
		if (!cacheDir) {
			directory = getNodeModuleDirectory(directory, name);
			if (directory === undefined) {
				return undefined;
			}
		}

		if (options.create) {
			makeDir.sync(directory);
		}

		if (options.thunk) {
			return (...arguments_) => path.join(directory, ...arguments_);
		}
	}

	return directory;
};
