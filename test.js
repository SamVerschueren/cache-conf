import path from 'path';
import test from 'ava';
import tempfile from 'tempfile';
import delay from 'delay';
import CacheConf from './';

const fixture = '🦄';

test.beforeEach(t => {
	t.context.conf = new CacheConf({cwd: tempfile()});
});

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
	t.context.conf.set('unicorn', fixture, {maxAge: 100});
	t.is(t.context.conf.get('unicorn'), fixture);
	t.false(t.context.conf.isExpired('unicorn'));
	await delay(100);
	t.falsy(t.context.conf.get('unicorn'));
});

test('.set() with object', async t => {
	t.context.conf.set({
		unicorn: fixture,
		foo: 'bar'
	}, {maxAge: 100});

	t.is(t.context.conf.get('unicorn'), fixture);
	t.is(t.context.conf.get('foo'), 'bar');
	await delay(100);
	t.falsy(t.context.conf.get('unicorn'));
	t.falsy(t.context.conf.get('foo'));
});
