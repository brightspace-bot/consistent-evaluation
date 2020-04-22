import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationFooter extends LitElement {
	static get properties() {
		return {
			published: { type: Boolean },
			showNextStudent: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			#footer-container {
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.button-container {
				margin: 0 0.3rem
			}
		`;
	}

	constructor() {
		super();
		this.published = false;
		this.showNextStudent = false;
	}

	getPublishOrRetractButton() {
		const text = this.published ? 'Retract' : 'Publish';
		return html`<d2l-button primary>${text}</d2l-button>`;
	}

	getSaveDraftOrUpdateButton() {
		const text = this.published ? 'Update' : 'Save Draft';
		return html`<d2l-button>${text}</d2l-button>`;
	}

	getNextStudentButton() {
		return this.showNextStudent ? html`
			<d2l-button-subtle icon="tier1:chevron-right" icon-right text="Next Student"></d2l-button-subtle>
		` : html``;
	}

	render() {
		return html`
			<div id="footer-container">
				<div class="button-container">
					${this.getPublishOrRetractButton()}
				</div>
				<div class="button-container">
					${this.getSaveDraftOrUpdateButton()}
				</div>
				<div class="button-container">
					${this.getNextStudentButton()}
				</div>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-footer', ConsistentEvaluationFooter);
