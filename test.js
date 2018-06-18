import fs from 'fs';
import path from 'path';
import del from 'del';
import {serial as test} from 'ava';
import fn from '.';

test('finds from a list of files', t => {
	process.chdir(path.join(__dirname, '..'));
	const files = ['foo/bar', 'baz/quz'].map(file => path.join(__dirname, file));
	t.is(fn({files, name: 'blah'}), path.join(__dirname, 'node_modules', '.cache', 'blah'));
});

test('finds from process.cwd', t => {
	process.chdir(path.join(__dirname));
	t.is(fn({name: 'foo'}), path.join(__dirname, 'node_modules', '.cache', 'foo'));
});

test('finds from options.cwd', t => {
	process.chdir(path.join(__dirname, '..'));
	t.is(fn({cwd: __dirname, name: 'bar'}), path.join(__dirname, 'node_modules', '.cache', 'bar'));
});

test('creates dir', t => {
	const dir = path.join(__dirname, 'node_modules', '.cache', 'created');
	del.sync(dir);
	fn({create: true, name: 'created', cwd: __dirname});
	t.true(fs.existsSync(dir));
});

test('thunk', t => {
	const dir = path.join(__dirname, 'node_modules', '.cache', 'thunked');
	del.sync(dir);
	const thunk = fn({thunk: true, name: 'thunked', cwd: __dirname});
	t.is(thunk('foo'), path.join(dir, 'foo'));
	t.is(thunk('bar'), path.join(dir, 'bar'));
});

test('returns null if it can\'t find package.json', t => {
	process.chdir(path.join(__dirname, '..'));
	t.is(fn({name: 'foo'}), null);
});
