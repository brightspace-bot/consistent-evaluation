import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import '@brightspace-ui/core/components/list/list.js';
import './consistent-evaluation-submission-item.js';
import { html, LitElement } from 'lit-element/lit-element.js';

export class ConsistentEvaluationSubmissionsPage extends LitElement {
	static get properties() {
		return {
			submissionList: { type: Array },
			token: { type: String },
			evaluationState: { type: String }
		};
	}

	constructor() {
		super();
		this._submissionList = [];
		this._token = undefined;
		this._submissionEntities = [];
	}

	get submissionList() {
		return this._submissionList;
	}

	set submissionList(val) {
		const oldVal = this.submissionList;
		if (oldVal !== val) {
			this._submissionList = val;
			this._initialize().then(() => this.requestUpdate());
		}
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

	async _initialize() {
		if (this._submissionList !== undefined) {
			for (const submissionLink of this._submissionList) {
				if (submissionLink.href) {
					const submission = await this._getSubmissionEntity(submissionLink.href);
					this._submissionEntities.push(submission);
				}
			}
		}
	}

	async _getSubmissionEntity(submissionHref) {
		return await window.D2L.Siren.EntityStore.fetch(submissionHref, this._token, false);
	}

	_renderListItems() {
		const itemTemplate = [];
		for (let i = 0; i < this._submissionEntities.length; i++) {
			if (this._submissionEntities[i].entity) {
				const assignmentSubmission = this._submissionEntities[i].entity;
				itemTemplate.push(html`
				<consistent-evaluation-submission-item
				.assignmentSubmission=${assignmentSubmission}
				.displayNumber=${this._submissionEntities.length - i}
				dateStr=${assignmentSubmission.getSubEntityByClass('date').properties.date}
				evaluationState=${this.evaluationState}
				></consistent-evaluation-submission-item>`);
			}
		}
		return html`${itemTemplate}`;
	}

	render() {
		return html`<d2l-list>
				${this._renderListItems()}
				</d2l-list>`;
	}
}

customElements.define('consistent-evaluation-submissions-page', ConsistentEvaluationSubmissionsPage);
