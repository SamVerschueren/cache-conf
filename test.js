import test from 'ava';
import tempfile from 'tempfile';
import delay from 'delay';
import CacheConf from './';

const fixture = '🦄';

test.beforeEach(t => {
	t.context.conf = new CacheConf({cwd: tempfile()});
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
