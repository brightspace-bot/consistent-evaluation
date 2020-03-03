import '../consistent-evaluation.js';
import { expect, fixture, html } from '@open-wc/testing';

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

describe('d2l-consistent-evaluation', () => {

	it('should pass all axe tests', async() => {
		const el = await fixture(html`<d2l-consistent-evaluation></d2l-consistent-evaluation>`);
		expect(el).to.be.accessible();
		await timeout(500);
	});
	
});
