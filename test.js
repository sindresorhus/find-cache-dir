import fs from 'fs';
import path from 'path';
import findCacheDir from '.';
import {serial as test} from 'ava';
import del from 'del';
import {directory as tempDir} from 'tempy';

test('finds from a list of files', t => {
	process.chdir(path.join(__dirname, '..'));
	const files = ['foo/bar', 'baz/quz'].map(file => path.join(__dirname, file));
	t.is(findCacheDir({files, name: 'blah'}), path.join(__dirname, 'node_modules', '.cache', 'blah'));
});

test('finds from process.cwd', t => {
	process.chdir(path.join(__dirname));
	t.is(findCacheDir({name: 'foo'}), path.join(__dirname, 'node_modules', '.cache', 'foo'));
});

test('finds from options.cwd', t => {
	process.chdir(path.join(__dirname, '..'));
	t.is(findCacheDir({cwd: __dirname, name: 'bar'}), path.join(__dirname, 'node_modules', '.cache', 'bar'));
});

test('supports CACHE_DIR environmental variable', t => {
	const newCacheDir = tempDir();
	process.env.CACHE_DIR = newCacheDir;
	t.is(findCacheDir(), path.join(newCacheDir, 'find-cache-dir'));
	delete process.env.CACHE_DIR;
});

test('creates dir', t => {
	const directory = path.join(__dirname, 'node_modules', '.cache', 'created');
	del.sync(directory);
	findCacheDir({create: true, name: 'created', cwd: __dirname});
	t.true(fs.existsSync(directory));
});

test('thunk', t => {
	const directory = path.join(__dirname, 'node_modules', '.cache', 'thunked');
	del.sync(directory);
	const thunk = findCacheDir({thunk: true, name: 'thunked', cwd: __dirname});
	t.is(thunk('foo'), path.join(directory, 'foo'));
	t.is(thunk('bar'), path.join(directory, 'bar'));
});

test('returns undefined if it can\'t find package.json', t => {
	process.chdir(path.join(__dirname, '..'));
	t.is(findCacheDir({name: 'foo'}), undefined);
});
