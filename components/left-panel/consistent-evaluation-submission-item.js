import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading4Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export class ConsistentEvaluationSubmissionItem extends LitElement {
	static get properties() {
		return {
			assignmentSubmission : { type: Object },
			displayNumber : { type: Number },
			dateStr : { type: String },
			evaluationState : { type: String }
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
		this._assignmentSubmission = undefined;
		this._date = undefined;
		this._attachments = [];
		this._comment = '';
	}

	get assignmentSubmission() {
		return this._assignmentSubmission;
	}

	set assignmentSubmission(newSubmission) {
		const oldVal = this.submissionList;
		if (oldVal !== newSubmission) {
			this._assignmentSubmission = newSubmission;
			this._initializeAttachments();
			this.requestUpdate();
		}
	}

	set dateStr(str) {
		this._date = new Date(str);
	}

	_initializeAttachments() {
		const attachmentsListEntity = this._assignmentSubmission.getSubEntityByClass('attachment-list');
		if (attachmentsListEntity && attachmentsListEntity.entities) {
			this._attachments = attachmentsListEntity.entities;
		}
		if (this.assignmentSubmission.getSubEntityByClass('submission-comment')) {
			this._comment = this.assignmentSubmission.getSubEntityByClass('submission-comment').properties.html;
		}
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

	_renderTitle() {
		return html`<h3 class="first-item">Submission ${this.displayNumber}</h3>\n
		<p class="submission-info">${this._date.toDateString()} ${this._date.toLocaleTimeString()}<d2l-icon icon="tier1:dot"></d2l-icon>${this.evaluationState}</p>`;
	}

	_renderAttachments() {
		return html`${this._attachments.map((attachment) => html`
		<d2l-list-item>
		<d2l-list-item-content>
		<d2l-icon class="item" icon="tier2:${this._getIcon(attachment.properties.name)}"></d2l-icon>
		<div class="item">
		<a href="${attachment.properties.href}"><span>${attachment.properties.name}</span></a>
		<div slot="secondary">${this._getReadableFileSizeString(attachment.properties.size)}</div></div>
		</d2l-list-item-content>
		</d2l-list-item>\n`)}
		`;
	}

	_renderComment() {
		if (this._comment) {
			return html`<d2l-list-item><d2l-list-item-content>
			<div class="d2l-label-text">Comments</div>
			<div slot="secondary">${unsafeHTML(this._comment)}</div>
			</d2l-list-item-content>
			</d2l-list-item>`;
		}
		return html``;
	}

	render() {
		return html`
		${this._renderTitle()}
		${this._renderAttachments()}
		${this._renderComment()}
		`;
	}
}
customElements.define('consistent-evaluation-submission-item', ConsistentEvaluationSubmissionItem);
