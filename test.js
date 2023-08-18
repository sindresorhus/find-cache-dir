import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {deleteSync} from 'del';
import {temporaryDirectory} from 'tempy';
import findCacheDirectory from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('finds from a list of files', t => {
	process.chdir(path.join(__dirname, '..'));
	const files = ['foo/bar', 'baz/quz'].map(file => path.join(__dirname, file));
	t.is(findCacheDirectory({files, name: 'blah'}), path.join(__dirname, 'node_modules', '.cache', 'blah'));
});

test('finds from process.cwd', t => {
	process.chdir(path.join(__dirname));
	t.is(findCacheDirectory({name: 'foo'}), path.join(__dirname, 'node_modules', '.cache', 'foo'));
});

test('finds from options.cwd', t => {
	process.chdir(path.join(__dirname, '..'));
	t.is(findCacheDirectory({cwd: __dirname, name: 'bar'}), path.join(__dirname, 'node_modules', '.cache', 'bar'));
});

test('creates directory', t => {
	const directory = path.join(__dirname, 'node_modules', '.cache', 'created');
	deleteSync(directory);
	findCacheDirectory({create: true, name: 'created', cwd: __dirname});
	t.true(fs.existsSync(directory));
});

test('returns undefined if it can\'t find package.json', t => {
	process.chdir(path.join(__dirname, '..'));
	t.is(findCacheDirectory({name: 'foo'}), undefined);
});

test('supports CACHE_DIR environment variable', t => {
	const newCacheDirectory = temporaryDirectory();
	const finalDirectory = path.join(newCacheDirectory, 'some-package');
	process.env.CACHE_DIR = newCacheDirectory;

	t.is(findCacheDirectory({name: 'some-package'}), finalDirectory);

	findCacheDirectory({name: 'some-package', create: true});
	t.true(fs.existsSync(finalDirectory));

	delete process.env.CACHE_DIR;
});

test('ignores `false` for CACHE_DIR environment variable', t => {
	process.env.CACHE_DIR = 'false';

	t.not(findCacheDirectory(), path.resolve(__dirname, 'false', 'find-cache-dir'));
});
