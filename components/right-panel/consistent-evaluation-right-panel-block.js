import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/dialog/dialog-fullscreen.js';

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
			},
			_dialogOpened: {
				type: Boolean
			},
			_isMobile: {
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
			.d2l-list-item {
				padding-left: 0.75rem;
				padding-right: 0.75rem;
			}
		`];
	}

	constructor() {
		super();
		this._dialogOpened = false;
		this.noTitle = false;
		this._isMobile = (window.innerWidth <= 768);
		window.addEventListener('resize', this._handleResize.bind(this));
	}

	_handleResize() {
		this._isMobile = (window.innerWidth <= 768);
		if (!this._isMobile && this._dialogOpened) {
			this._toggleOpenDialog();
		}
	}

	_getTitle() {
		return this.noTitle ? html`` : html`<div class="d2l-label-text">${this.title}</div>`;
	}

	_toggleOpenDialog() {
		this._dialogOpened = !this._dialogOpened;
	}

	_renderListItems() {
		return html`
			<d2l-list-item class="d2l-list-item"
				@click=${this._toggleOpenDialog}>
				<d2l-list-item-content class="no-border">
					${this._getTitle()}
					<div slot="supporting-info"> supporting info for ${this.title}</div>
				</d2l-list-item-content>
			</d2l-list-item>
		`;
	}

	render() {
		if (this._isMobile) {
			return html`
				${this._renderListItems()}
				<d2l-dialog-fullscreen ?opened=${this._dialogOpened} title-text=${this.title}
				@d2l-dialog-close=${this._onListItemClick}>
					<slot></slot>
				</d2l-dialog-fullscreen>
			`;
		}
		return html`
			<div class="d2l-block">
				${this._getTitle()}
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-right-panel-block', ConsistentEvaluationRightPanelBlock);
