import { css, html, LitElement } from 'lit-element';

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
		return css`
			.block {
				margin-top: .75rem;
				padding-left: .75rem;
			}
		`;
	}

	constructor() {
		super();
		this.noTitle = false;
	}

	_getTitle() {
		return this.noTitle ? html`` : html`<d2l-label-text>${this.title}</d2l-label-text>`;
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
