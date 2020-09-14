import { css, html, LitElement } from 'lit-element';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

class ConsistentEvaluationRightPanelBlock extends LitElement {
	static get properties() {
		return {
			title: {
				type: String
			},
			noTitle: {
				attribute: 'no-title',
				type: Boolean
			}
		};
	}

	static get styles() {
		return [labelStyles, css`
			.d2l-block {
				margin-top: 1.35rem;
				padding-left: 0.75rem;
				padding-right: 0.75rem;
			}
			.d2l-label-text {
				margin-bottom: 0.4rem;
			}
		`];
	}

	constructor() {
		super();
		this.noTitle = false;
	}

	_getTitle() {
		return this.noTitle ? html`` : html`<div class="d2l-label-text">${this.title}</div>`;
	}

	render() {
		return html`
			<div class="d2l-block">
				${this._getTitle()}
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-right-panel-block', ConsistentEvaluationRightPanelBlock);
