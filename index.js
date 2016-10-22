'use strict';
const path = require('path');
const Conf = require('conf');
const pkgUp = require('pkg-up');

const parentDir = path.dirname(module.parent.filename);

class CacheConf extends Conf {

	constructor(options) {
		const pkgPath = pkgUp.sync(parentDir);

		options = Object.assign({
			projectName: pkgPath && require(pkgPath).name	// eslint-disable-line import/no-dynamic-require
		}, options);

		super(options);
	}

	get(key) {
		if (this.isExpired(key)) {
			super.delete(key);
			return;
		}

		const item = super.get(key);

		return item && item.data;
	}

	set(key, val, opts) {
		opts = opts || {};

		if (typeof key === 'object') {
			opts = val || {};

			Object.keys(key).forEach(k => {
				super.set(k, {
					timestamp: opts.maxAge && Date.now() + opts.maxAge,
					data: key[k]
				});
			});
		} else {
			super.set(key, {
				timestamp: opts.maxAge && Date.now() + opts.maxAge,
				data: val
			});
		}
	}

	has(key) {
		if (!super.has(key)) {
			return false;
		}

		if (this.isExpired(key)) {
			super.delete(key);
			return false;
		}

		return true;
	}

	isExpired(key) {
		const item = super.get(key);

		return Boolean(item && item.timestamp && item.timestamp < Date.now());
	}
}

module.exports = CacheConf;
