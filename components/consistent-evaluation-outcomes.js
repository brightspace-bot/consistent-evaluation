import './consistent-evaluation-secondary-block';
import { bodyCompactStyles, bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { html, LitElement } from 'lit-element';

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
		return [bodyCompactStyles, bodySmallStyles];
	}

	render() {
		return html`<consistent-evaluation-secondary-block title="Outcomes">
            <div class="d2l-body-small">${this.description}</div>
            <d2l-outcomes-level-of-achievements href="${this.href}" token="${this.token}"></d2l-outcomes-level-of-achievements>
        </consistent-evaluation-secondary-block>`;
	}
}

customElements.define('consistent-evaluation-outcomes', ConsistentEvaluationOutcomes);
