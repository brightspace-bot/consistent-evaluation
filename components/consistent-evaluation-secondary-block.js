import { html, LitElement } from 'lit-element';

class ConsistentEvaluationSecondaryBlock extends LitElement {
	static get properties() {
		return {
			title: {
				type: String
			}
		};
	}

	render() {
		return html`
			<div class="container">
				<h3>${this.title}</h3>
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-secondary-block', ConsistentEvaluationSecondaryBlock);
