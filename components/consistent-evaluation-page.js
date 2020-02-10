import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export default class ConsistentEvaluationPage extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			overallScore: { type: Number },
			overallScoreTwo: { type: Number },
			scores: { type: Array }
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
			d2l-input-text {
				margin-bottom: 1.5rem;
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

		this.overallScore = NaN;
		this.overallScoreTwo = NaN;
		this.scores = [];
	}

	handleChange(i) {
		return (e) => {
			this.dispatchEvent(
				new CustomEvent('d2l-score-changed', {
					detail: {
						score: parseInt(e.target.value),
						i: i
					}
				}));
		};
	}

	render() {
		return html`
			<d2l-template-primary-secondary>
				<div slot="header"><h1>Hello, consistent-evaluation!</h1></div>
				<div slot="primary">
					${this.scores.map((s, i) => html`<d2l-input-text
						label=${`Question ${i + 1} Score`}
						placeholder="%"
						type="number"
						value=${s}
						min="0"
						max="100"
						@change=${this.handleChange(i)}>
					</d2l-input-text>`)}
				</div>
				<div slot="secondary">
					<div>${this.localize('overallAverage')}: ${this.overallScore}</div>
					<div>${this.localize('overallAverage')}2: ${this.overallScoreTwo}</div>
				</div>
			</d2l-template-primary-secondary>
		`;
	}
}
customElements.define('d2l-consistent-evaluation-page', ConsistentEvaluationPage);
