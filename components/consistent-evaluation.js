import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export default class ConsistentEvaluation extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			prop1: { type: String },
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
				case 'en':
					translations = await import('../locales/en.js');
					break;
			}

			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}

		return null;
	}

	constructor() {
		super();

		this.prop1 = 'consistent-evaluation';
	}

	render() {
		return html`
			<d2l-template-primary-secondary>
				<div slot="header"><h1>Hello ${this.prop1}!</h1></div>
				<div slot="primary">
					<div>Localization Example: ${this.localize('myLangTerm')}</div>
				</div>
				<div slot="secondary">
					<div>Localization Example: ${this.localize('myLangTerm')}</div>
				</div>
				<div slot="footer">Copyright D2L Corporation.</div>
			</d2l-template-primary-secondary>
		`;
	}
}
customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
