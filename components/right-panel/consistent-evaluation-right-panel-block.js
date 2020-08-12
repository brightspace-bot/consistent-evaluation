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
			.block {
				margin-top: .75rem;
				padding-left: .75rem;
			}
			.d2l-label-text {
				margin-bottom: .4rem;
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
			<div class="block">
				${this._getTitle()}
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-right-panel-block', ConsistentEvaluationRightPanelBlock);
