import '../<%= shortName %>.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<%= name %>', () => {

	it('should pass all axe tests', async() => {
		const el = await fixture(html`<<%= name %>></<%= name %>>`);
		expect(el).to.be.accessible();
	});

});
