import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/button/button.js';
import { bodySmallStyles, heading3Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export class ConsistentEvaluationSubmissionItem extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			assignmentSubmission : { type: Object },
			displayNumber : { type: Number },
			dateStr : { type: String },
			evaluationState : { type: String }
		};
	}

	static get styles() {
		return [heading3Styles, labelStyles, bodySmallStyles, css`
		.d2l-heading-3 {
			padding: 0;
			margin: 0;
		}
		.consistent-eval-submission-attachment-item {
			display: inline-block;
			vertical-align: middle;
			padding-left: 0.5rem;
		}
	`];
	}

	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
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
		const byteUnits = ['kB', 'MB', 'GB'];
		do {
			fileSizeBytes = fileSizeBytes / 1024;
			i++;
		} while (fileSizeBytes > 1024);
		const unit = this.localize(byteUnits[i]);
		return Math.max(fileSizeBytes, 0.1).toFixed(1) + unit;
	}

	_dispatchRenderEvidenceEvent() {
		const url = 'attachment.properties.annotationsViewer';

		const event = new CustomEvent('d2l-consistent-evaluation-submission-item-render-evidence', {
			detail: {
				url: url
			},
			composed: true
		});
		this.dispatchEvent(event);
	}

	_renderTitle() {
		const date = formatDateTime(
			this._date,
			{format: 'full'}
		);
		return html`
			<d2l-list-item>
			<d2l-list-item-content>
			<h3 class="d2l-heading-3">Submission ${this.displayNumber}</h3>
			<div class="d2l-body-small">${date}<d2l-icon icon="tier1:dot"></d2l-icon>${this.evaluationState}</div>
			</d2l-list-item-content>
			</d2l-list-item>`;
	}

	_renderAttachments() {
		return html`${this._attachments.map((attachment) => html`
			<d2l-list>
			<d2l-list-item>
			<d2l-list-item-content>
			<d2l-icon class="consistent-eval-submission-attachment-item" icon="tier2:${this._getIcon(attachment.properties.name)}"></d2l-icon>
			<div class="consistent-eval-submission-attachment-item">
			<a href="${attachment.properties.href}"><span>${attachment.properties.name}</span></a>
			<div slot="secondary" class="d2l-body-small">${this._getReadableFileSizeString(attachment.properties.size)}</div>

			<d2l-button
				@click="${this._dispatchRenderEvidenceEvent}">View File
			</d2l-button>

			</div>
			</d2l-list-item-content>
			</d2l-list-item>
			</d2l-list>`)}`;
	}

	_renderComment() {
		if (this._comment) {
			return html`
				<d2l-list-item><d2l-list-item-content>
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
customElements.define('d2l-consistent-evaluation-submission-item', ConsistentEvaluationSubmissionItem);
