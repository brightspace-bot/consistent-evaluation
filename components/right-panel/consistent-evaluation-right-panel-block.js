import '@brightspace-ui/core/components/colors/colors.js';
import './consistent-evaluation-accordion-collapse.js';
import { css, html, LitElement } from 'lit-element';
import { heading4Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

class ConsistentEvaluationRightPanelBlock extends LitElement {
	static get properties() {
		return {
			title: {
				type: String
			},
			noTitle: {
				attribute: 'no-title',
				type: Boolean
			},
			isMobile: {
				attribute: 'is-mobile',
				type: Boolean
			}
		};
	}

	static get styles() {
		return [labelStyles, heading4Styles, css`
			.d2l-block {
				margin-top: 1.35rem;
				padding-left: 0.75rem;
				padding-right: 0.75rem;
			}
			.d2l-label-text {
				margin-bottom: 0.0rem;
			}
			.d2l-accordion {
				padding: 20px;
				padding-top: 0px;
				border-top: 1px solid var(--d2l-color-mica);
				border-width: 1px;
			}
		`];
	}

	constructor() {
		super();
		this.noTitle = false;
		this.isMobile = false;
	}

	_getTitle() {
		return this.noTitle ? html`` : html`<div class="d2l-label-text">${this.title}</div>`;
	}

	render() {
		return this.isMobile ? html`
			<div class="d2l-block">
				${this._getTitle()}
				<slot></slot>
			</div>
		` : html` 
			<d2l-consistent-evaluation-accordion-collapse
				class="d2l-accordion">
				<span slot="header">
					${this._getTitle()}
				</span>
				<li slot="summary-items">Something about ${this.title}</li>
				<span slot="components">
					<slot></slot>
				</span>
			</d2l-consistent-evaluation-accordion-collapse>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-right-panel-block', ConsistentEvaluationRightPanelBlock);
