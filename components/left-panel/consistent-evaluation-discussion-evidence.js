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
		const post1 = {};
		post1.title = 'Post 1';
		post1.body = 'The body of the first post';
		post1.wordCount = 6;
		post1.href = 'https://www.mlb.com';
		post1.date = 'June 12, 2020 - 10:17 AM';

		const post2 = {};
		post2.title = 'Post 2';
		post2.body = 'Second post';
		post2.wordCount = 2;
		post2.href = 'https://www.nfl.com';
		post2.date = 'March 7, 2016 - 12:20 AM';

		return [
			post1, post2
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
