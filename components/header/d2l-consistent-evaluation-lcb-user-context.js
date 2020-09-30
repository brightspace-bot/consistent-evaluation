import 'd2l-users/components/d2l-profile-image.js';
import { css, html, LitElement } from 'lit-element';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

export class ConsistentEvaluationLcbUserContext extends RtlMixin(LitElement) {

	static get properties() {
		return {
			displayName: {
				attribute: 'display-name',
				type: String
			},
			profileImageHref: {
				attribute: 'profile-image-href',
				type: String
			},
			token: {
				type: String
			}
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				align-items: center;
				display: flex;
			}
			.d2l-consistent-evaluation-lcb-user-name {
				margin-left: 0.5rem;
				max-width: 10rem;
				min-width: 2rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}
			:host([dir="rtl"]) .d2l-consistent-evaluation-lcb-user-name {
				margin-left: 0;
				margin-right: 0.5rem;
			}
		`];
	}

	render() {
		return html`
			<d2l-profile-image
				href="${this.profileImageHref}"
				token="${this.token}"
				small
			></d2l-profile-image>
			<span class="d2l-body-compact d2l-consistent-evaluation-lcb-user-name">${ifDefined(this.displayName)}</span>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-user-context', ConsistentEvaluationLcbUserContext);
