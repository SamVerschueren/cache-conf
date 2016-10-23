import path from 'path';
import test from 'ava';
import tempfile from 'tempfile';
import delay from 'delay';
import CacheConf from './';

const fixture = '🦄';

test('constructor', async t => {
	const conf = new CacheConf();
	const filePath = conf.path.split(path.sep);

	t.is(filePath.pop(), 'config.json');
	t.is(filePath.pop(), 'cache-conf-nodejs');
});

test('project name', async t => {
	const conf = new CacheConf({projectName: 'foo'});
	const filePath = conf.path.split(path.sep);

	t.is(filePath.pop(), 'config.json');
	t.is(filePath.pop(), 'foo-nodejs');
});

test('.set()', async t => {
	const conf = new CacheConf({cwd: tempfile()});

	conf.set('unicorn', fixture, {maxAge: 100});
	t.is(conf.get('unicorn'), fixture);
	t.false(conf.isExpired('unicorn'));
	await delay(100);
	t.falsy(conf.get('unicorn'));
});

test('.set() with object', async t => {
	const conf = new CacheConf({cwd: tempfile()});

	conf.set({
		unicorn: fixture,
		foo: 'bar'
	}, {maxAge: 100});

	t.is(conf.get('unicorn'), fixture);
	t.is(conf.get('foo'), 'bar');
	await delay(100);
	t.falsy(conf.get('unicorn'));
	t.falsy(conf.get('foo'));
});

test('version', async t => {
	const cwd = tempfile();

	const conf = new CacheConf({cwd, version: '1.0.0'});
	conf.set('foo', 'bar');
	t.is(conf.get('foo'), 'bar');

	const conf2 = new CacheConf({cwd, version: '1.0.0'});
	t.is(conf2.get('foo'), 'bar');

	const conf3 = new CacheConf({cwd, version: '1.1.0'});
	t.falsy(conf3.get('foo'));
});
