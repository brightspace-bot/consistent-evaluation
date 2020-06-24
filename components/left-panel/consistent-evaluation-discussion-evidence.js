import './consistent-evaluation-discussion-evidence-presentational.js';
import { html, LitElement } from 'lit-element/lit-element.js';

export class ConsistentEvaluationDiscussionEvidence extends LitElement {
	static get properties() {
		return {
			href: { type: String },
			token: { type: String }
		};
	}

	constructor() {
		super();
		this._token = undefined;
	}

	get token() {
		return this._token;
	}

	set token(val) {
		const oldVal = this.token;
		if (oldVal !== val) {
			this._token = val;
			this.requestUpdate();
		}
	}

	_buildPostList() {
		return [
			'post1', 'post2', 'post3'
		];
	}

	render() {
		return html`
			<d2l-consistent-evaluation-discussion-evidence-presentational
				.posts=${this._buildPostList()}
				.profileImageHref=""
				.token="${this.token}"
				userName="User Name"
			></d2l-consistent-evaluation-discussion-evidence-presentational>`;
	}
}

customElements.define('d2l-consistent-evaluation-discussion-evidence', ConsistentEvaluationDiscussionEvidence);
