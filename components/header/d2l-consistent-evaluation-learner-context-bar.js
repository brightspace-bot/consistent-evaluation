import 'd2l-users/components/d2l-profile-image-base.js';
import { css, html, LitElement } from 'lit-element';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';

export class ConsistentEvaluationLearnerContextBar extends LitElement {

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
		`];
	}

	render() {
		return html`
			<d2l-profile-image-base
				href="${this.profileImageHref}"
				first-name="${this.firstName}"
				last-name="${this.lastName}"
				colour-id="${this.colourId}"
				medium
			></d2l-profile-image-base>
			<span class="d2l-body-standard d2l-consistent-evaluation-lcb-user-name">${this.firstName} ${this.lastName}</span>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-learner-context-bar', ConsistentEvaluationLearnerContextBar);
