import 'd2l-users/components/d2l-profile-image-base.js';
import { css, html, LitElement } from 'lit-element';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

export class ConsistentEvaluationLcbUserContext extends RtlMixin(LitElement) {

	static get properties() {
		return {
			profileImageHref: {
				attribute: 'profile-image-href',
				type: String
			},
			firstName: {
				attribute: 'first-name',
				type: String
			},
			lastName: {
				attribute: 'last-name',
				type: String
			},
			colourId: {
				attribute: 'colour-id',
				type: String
			},
			displayName: {
				attribute: 'display-name',
				type: String
			}
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`
			.d2l-consistent-evaluation-lcb-user-name {
				font-weight: bold;
				margin-left: 0.5rem;
				max-width: 10rem;
				min-width: 2rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}
			:host([dir="rtl"]) .d2l-consistent-evaluation-lcb-user-name {
				margin-right: 0.5rem;
			}
		`];
	}

	render() {
		return html`
			<d2l-profile-image-base
				href="${this.profileImageHref}"
				first-name="${ifDefined(this.firstName)}"
				last-name="${ifDefined(this.lastName)}"
				colour-id="${this.colourId}"
				medium
			></d2l-profile-image-base>
			<span class="d2l-body-standard d2l-consistent-evaluation-lcb-user-name">${ifDefined(this.displayName)}</span>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-user-context', ConsistentEvaluationLcbUserContext);
