import { html, LitElement } from 'lit-element';

class ConsistentEvaluationRubric extends LitElement {
	static get properties() {
		return {
			header: {
				type: String
			},
			href: {
				type: String
			},
			assessmentHref: {
				type: String
			},
			token: {
				type: String
			},
			readonly: {
				type: Boolean
			}
		};
	}

	render() {
		return html`
			<d2l-consistent-evaluation-secondary-block title="${this.header}">
				<d2l-rubric
					href="${this.href}"
					assessment-href="${this.assessmentHref}"
					token="${this.token}"
					?read-only="${this.readonly}"
					force-Compact
					overall-score-flag
					outcomes-title-text="test"
				>
				</d2l-rubric>
			</d2l-consistent-evaluation-secondary-block>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-rubric', ConsistentEvaluationRubric);
