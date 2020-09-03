import './d2l-consistent-evaluation-lcb-user-context.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export class ConsistentEvaluationLearnerContextBar extends LitElement {

	static get properties() {
		return {
			userInfo: {
				attribute: false,
				type: Object
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				height: 100%;
				margin: 1rem;
			}
		`;
	}

	get _firstName() {
		if (this.userInfo) {
			const firstNameEntity = this.userInfo.getSubEntityByRel('https://api.brightspace.com/rels/first-name');

			if (firstNameEntity) {
				return firstNameEntity.properties.name;
			}
		}
		return '';
	}

	get _lastName() {
		if (this.userInfo) {
			const lastNameEntity = this.userInfo.getSubEntityByRel('https://api.brightspace.com/rels/last-name');

			if (lastNameEntity) {
				return lastNameEntity.properties.name;
			}
		}
		return '';
	}

	get _colourId() {
		return 9;
	}

	get _displayName() {
		if (this.userInfo) {
			const displayNameEntity = this.userInfo.getSubEntityByRel('https://api.brightspace.com/rels/display-name');

			if (displayNameEntity) {
				return displayNameEntity.properties.name;
			}
		}
		return undefined;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-lcb-user-context
				profile-image-href=""
				first-name="${this._firstName}"
				last-name="${this._lastName}"
				colour-id="${this._colourId}"
				display-name="${ifDefined(this._displayName)}"
			></d2l-consistent-evaluation-lcb-user-context>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-learner-context-bar', ConsistentEvaluationLearnerContextBar);
