import './consistent-evaluation-secondary-block';
import 'd2l-outcomes-level-of-achievements/d2l-outcomes-level-of-achievements.js';
import { html, LitElement } from 'lit-element';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';

class ConsistentEvaluationOutcomes extends LitElement {
	static get properties() {
		return {
			href: {
				type: String
			},
			token: {
				type: String
			},
			description: {
				type: String
			}
		};
	}

	static get styles() {
		return [bodySmallStyles];
	}

	render() {
		return html`
			<d2l-consistent-evaluation-secondary-block title="Outcomes">
				<div class="d2l-body-small">${this.description}</div>
				<d2l-outcomes-level-of-achievements href="${this.href}" token="${this.token}"></d2l-outcomes-level-of-achievements>
			</d2l-consistent-evaluation-secondary-block>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-outcomes', ConsistentEvaluationOutcomes);
