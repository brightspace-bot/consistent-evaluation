import './d2l-consistent-evaluation-lcb-user-context.js';
import './d2l-consistent-evaluation-lcb-file-context.js';
import { html, LitElement } from 'lit-element';

export class ConsistentEvaluationLearnerContextBar extends LitElement {

	static get properties() {
		return {
			userInfo: {
				attribute: false,
				type: Object
			},
			submissionInfo: {
				attribute: false,
				type: Object
			}
		};
	}

	get _userName() {
		if (this.userInfo) {
			console.log(this.userInfo);
			return this.userInfo.getSubEntityByRel('first-name');
		}
		return undefined;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-lcb-user-context
				profile-image-href=""
				first-name="${this._userName}"
				last-name
				colour-id
			></d2l-consistent-evaluation-lcb-user-context>
			<d2l-consistent-evaluation-lcb-file-context>
			.submissionInfo="${this.submissionInfo}"
			</d2l-consistent-evaluation-lcb-file-context>

		`;
	}
}

customElements.define('d2l-consistent-evaluation-learner-context-bar', ConsistentEvaluationLearnerContextBar);
