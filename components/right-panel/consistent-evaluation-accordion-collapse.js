import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui-labs/accordion/accordion-collapse.js';
import 'd2l-navigation/d2l-navigation-immersive.js';
import 'd2l-navigation/d2l-navigation-link-back.js';

import { bodySmallStyles, heading4Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class ConsistentEvaluationAccordionCollapse extends SkeletonMixin(LitElement) {
	static get properties() {
		return {
			_opened: { type: Boolean }
		};
	}

	static get styles() {
		return [
			super.styles,
			bodySmallStyles,
			heading4Styles,
			css`
				:host {
					display: block;
				}

				:host([hidden]) {
					display: none;
				}

				.d2l-activity-summarizer-header {
					margin-bottom: 0px;
					margin-top: 20px;
				}

				.d2l-activity-summarizer-summary {
					color: var(--d2l-color-tungsten);
					list-style: none;
					margin-top: 5px;
					min-height: 20px;
					padding: 0;
				}

				ul.d2l-activity-summarizer-summary > li {
					margin-bottom: 8px;
				}

				ul.d2l-activity-summarizer-summary > li:last-child {
					margin-bottom: 0;
				}
                .fullscreen{
                    background: white;
                    z-index: 9999; 
                    width: 100%; 
                    height: 100%; 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                }
			`
		];
	}

	constructor() {
		super();
		this._opened = false;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	render() {
		return html`
            <d2l-labs-accordion-collapse
				?opened=${this._opened}
				no-icons=true
				@d2l-labs-accordion-collapse-state-changed=${this._onAccordionStateChange}>

                <d2l-navigation-immersive>
                    <d2l-navigation-link-back
                        slot="left"
                        @click=${this._onBackPress}>
                    </d2l-navigation-link-back>
                </d2l-navigation-immersive>

				<h3 class="d2l-heading-4 d2l-activity-summarizer-header d2l-skeletize" slot="header">
					<slot name="header"></slot>
                </h3>

				<ul class="d2l-body-small d2l-activity-summarizer-summary" slot="summary">
                    <slot name="summary-items">
                    </slot>
                </ul>
                
				<slot name="components"></slot>
			</d2l-labs-accordion-collapse>
		`;
	}

	_onBackPress() {
		this._opened = false;
		this.shadowRoot.querySelector('d2l-labs-accordion-collapse').toggleClass('fullscreen');
	}

	_onAccordionStateChange(e) {
		if (this._opened) {
			this.shadowRoot.querySelector('d2l-labs-accordion-collapse').toggleClass('fullscreen');
		}

		this.shadowRoot.querySelector('d2l-labs-accordion-collapse').scrollIntoView({ behavior: 'smooth'});
		this._opened = e.detail.opened;

	}
}

customElements.define('d2l-consistent-evaluation-accordion-collapse', ConsistentEvaluationAccordionCollapse);
