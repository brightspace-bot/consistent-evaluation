import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading4Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

export class ConsistentEvaluationSubmissionsPage extends LitElement {
	static get properties() {
		return {
			submissionList: { type: Array },
			token: { type: String },
			evaluationState: { type: String }
		};
	}

	static get styles() {
		return [heading4Styles, labelStyles, css`
		.submission-info{
			margin: 0;
			padding: 0;
			font-size: 0.7rem;
			font-weight: 400;
			letter-spacing: 0.2px;
		}
		.last-item {
			padding-bottom: 1rem;
		}
		.first-item {
			padding-top: 1rem;
			margin: 0;
		}
		.item {
			display: inline-block;
			vertical-align: middle;
			padding-left: 0.5rem;
		}
	`];
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

	_getIcon(filename) {
		const ext = filename.split('.')[1];
		if (ext === 'png' || ext === 'jpg') {
			return 'file-image';
		}
		else {
			return 'file-document';
		}
	}

	_getReadableFileSizeString(fileSizeBytes) {
		let i = -1;
		const byteUnits = [' kB', ' MB', ' GB'];
		do {
			fileSizeBytes = fileSizeBytes / 1024;
			i++;
		} while (fileSizeBytes > 1024);
		return Math.max(fileSizeBytes, 0.1).toFixed(1) + byteUnits[i];
	}

	_getSubmissionDisplayHtml(displayNumber, date) {
		return `<h3 class="first-item">Submission ${displayNumber}</h3>\n
		<p class="submission-info">${date.toDateString()} ${date.toLocaleTimeString()}<d2l-icon icon="tier1:dot"></d2l-icon>${this.evaluationState}</p>`;
	}

	_getAttachmentDisplayHtml(href, filename, fileSizeBytes) {
		return `<d2l-list-item>
		<d2l-list-item-content>
		<d2l-icon class="item" icon="tier2:${this._getIcon(filename)}"></d2l-icon>
		<div class="item">
		<a href="${href}"><span>${filename}</span></a>
		<div slot="secondary">${this._getReadableFileSizeString(fileSizeBytes)}</div></div>
		</d2l-list-item-content>
		</d2l-list-item>\n`;
	}

	_getCommentDisplayHtml(comment) {
		return `<d2l-list-item><d2l-list-item-content>
		<div class="d2l-label-text">Comments</div>
		<div slot="secondary">${comment}</div>
		</d2l-list-item-content>
		</d2l-list-item>`;
	}

	_renderList() {
		let builder = '';
		for (let j = 0; j < this._submissionEntities.length; j++) {
			if (this._submissionEntities[j].entity) {
				const assignmentSubmission = this._submissionEntities[j].entity;
				const displayNumber = this._submissionEntities.length - j;
				const dateStr = assignmentSubmission.getSubEntityByClass('date').properties.date;
				const date = new Date(dateStr);
				const attachmentsListEntity = assignmentSubmission.getSubEntityByClass('attachment-list');
				builder += this._getSubmissionDisplayHtml(displayNumber, date);
				if (attachmentsListEntity && attachmentsListEntity.entities) {
					const attachmentsList = attachmentsListEntity.entities;
					for (let i = 0; i < attachmentsList.length; i++) {
						const filename = attachmentsList[i].properties.name;
						const fileSizeBytes = attachmentsList[i].properties.size;
						builder += this._getAttachmentDisplayHtml(attachmentsList[i].properties.href, filename, fileSizeBytes);
					}
				}
				let comment = '';
				if (assignmentSubmission.getSubEntityByClass('submission-comment')) {
					comment = assignmentSubmission.getSubEntityByClass('submission-comment').properties.html;
					builder += this._getCommentDisplayHtml(comment);
				}
			}
		}
		const list = document.createElement('d2l-list');
		list.innerHTML = builder;
		return list;
	}

	render() {
		return html`
				${this._renderList()}
		`;
	}
}

customElements.define('consistent-evaluation-submissions-page', ConsistentEvaluationSubmissionsPage);
