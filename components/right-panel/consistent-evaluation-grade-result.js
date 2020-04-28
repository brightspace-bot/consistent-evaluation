import './consistent-evaluation-right-panel-block';
import { html, LitElement } from 'lit-element';

export class ConsistentEvaluationGradeResult extends LitElement {

	static get properties() {
		return {
			href: { type: String },
			token: {type: String}
		};
	}

	render() {
		return html`
			<d2l-consistent-evaluation-right-panel-block title="Overall Grade">
				<d2l-labs-d2l-grade-result
					href=${this.href}
					token=${this.token}
					_hideTitle
				></d2l-labs-d2l-grade-result>
			</d2l-consistent-evaluation-right-panel-block>
		`;
	}
}
customElements.define('d2l-consistent-evaluation-grade-result', ConsistentEvaluationGradeResult);
