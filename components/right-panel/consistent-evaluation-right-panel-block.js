import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';

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
			supportingInfo: {
				type: String
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
			.d2l-list-item {
				display: none;
			}
			.fullscreen {
				display: flex !important;
				background: white;
				z-index: 9999; 
				width: 100%; 
				height: 100%; 
				position: fixed; 
				top: 0; 
				left: 0; 
			}
			@media (max-width: 556px) {
				.d2l-label-text {
					margin-bottom: 0.0rem;
				}
				.d2l-block {
					display: none;
					margin-top: 1.35rem;
					padding-left: 0.75rem;
					padding-right: 0.75rem;
				}
				.d2l-list-item {
					display: block;
					padding: 20px;
					padding-top: 0px;
					padding-bottom: 0px;
					border-top: 1px solid var(--d2l-color-mica);
					border-width: 1px;
				}
			}
		`];
	}

	constructor() {
		super();
		this.noTitle = false;
		this.supportingInfo = `supporting asdfasdfsadfsafsadfsad info for ${this.title}`;
	}

	_getTitle() {
		return this.noTitle ? html`` : html`<div class="d2l-label-text">${this.title}</div>`;
	}

	_onListItemClick() {
		const content = this.shadowRoot.querySelector('d2l-expand-collapse-content');
		content.style.display = 'block';
		content.expanded = !content.expanded;
	}

	_renderListItems() {
		return html`
			<d2l-list-item class="d2l-list-item"
				@click=${this._onListItemClick}>
				<d2l-list-item-content class="no-border">
					${this._getTitle()}
					<div  slot="supporting-info">${this.supportingInfo}</div>
				</d2l-list-item-content>
			</d2l-list-item>
		`;
	}

	render() {
		return html`
			${this._renderListItems()}

			<d2l-expand-collapse-content class="d2l-block" expanded>
				${this._getTitle()}
				<slot></slot>
			</d2l-expand-collapse-content>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-right-panel-block', ConsistentEvaluationRightPanelBlock);
