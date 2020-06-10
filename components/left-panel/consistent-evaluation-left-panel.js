import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import './consistent-evaluation-evidence.js';
import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationLeftPanel extends LitElement {

	static get properties() {
		return {
			submissionList: { type: Array },
			token: { type: String },
			evaluationState: { type: String }
		};
	}

	static get styles() {
		return css`
			#d2l-consistent-evaluation-left-panel-evidence {
				overflow: hidden;
			}
		`;
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

	_renderEvidence() {
		const evidenceTemplate = [];
		if (this._submissionEntities[0].entity) {
			const assignmentSubmission = this._submissionEntities[0].entity;
			const attachmentsListEntity = assignmentSubmission.getSubEntityByClass('attachment-list');

			let attachments = [];
			if (attachmentsListEntity && attachmentsListEntity.entities) {
				attachments = attachmentsListEntity.entities;
			}

			const url = attachments[0].properties.annotationsViewer;
			console.log(url);

			evidenceTemplate.push(html`
			<d2l-consistent-evaluation-evidence
				class="d2l-consistent-evaluation-left-panel-evidence"
				url="${url}"
				token="${this.token}"
			></d2l-consistent-evaluation-evidence>`);
		}
		return html`${evidenceTemplate}`;
	}

	render() {
		return html`
			${this._renderEvidence()}
		`;
	}
}

customElements.define('d2l-consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
