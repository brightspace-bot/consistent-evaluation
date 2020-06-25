import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/more-less/more-less.js';
import '@brightspace-ui/core/components/status-indicator/status-indicator.js';
import { bodySmallStyles, heading3Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export class ConsistentEvaluationSubmissionItem extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			dateStr : { type: String },
			displayNumber : { type: Number },
			evaluationState : { type: String },
			late: { type: Boolean },
			submissionEntity : { type: Object },
			submissionType: { type: String }
		};
	}

	static get styles() {
		return [heading3Styles, labelStyles, bodySmallStyles, css`
		:host {
			background-color: #ffffff;
			border: 1px solid var(--d2l-color-gypsum);
			border-radius: 6px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			position: relative;
			z-index: 0;
		}
		.d2l-heading-3 {
			padding: 0;
			margin: 0;
		}
		.consistent-eval-submission-attachment-item {
			display: inline-block;
			vertical-align: middle;
			padding-left: 0.5rem;
		}
		.consistent-eval-submission-attachment-item-container:hover {
			background-color: var(--d2l-color-regolith);
		}
		.consistent-eval-submission-attachment-item-container {
			justify-content: space-between;
		}
	`];
	}

	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
	}

	constructor() {
		super();
		this._submissionEntity = undefined;
		this._date = undefined;
		this._attachments = [];
		this._comment = '';
	}

	get submissionEntity() {
		return this._submissionEntity;
	}

	set submissionEntity(newSubmission) {
		const oldVal = this.submissionList;
		if (oldVal !== newSubmission) {
			this._submissionEntity = newSubmission;
			this._initializeSubmissionProperties();
			this.requestUpdate();
		}
	}

	_initializeSubmissionProperties() {
		this._date = new Date(this.dateStr);
		const attachmentsListEntity = this._submissionEntity.getSubEntityByClass('attachment-list');
		if (attachmentsListEntity && attachmentsListEntity.entities) {
			this._attachments = attachmentsListEntity.entities;
		}
		if (this.submissionEntity.getSubEntityByClass('submission-comment')) {
			this._comment = this.submissionEntity.getSubEntityByClass('submission-comment').properties.html;
		}
	}

	_getIcon(filename) {
		const ext = this._getFileType(filename);
		if (ext === 'PNG' || ext === 'JPG') {
			return 'file-image';
		}
		else {
			return 'file-document';
		}
	}

	_getFileTitle(filename) {
		return filename.split('.')[0];
	}

	_getFileType(filename) {
		return filename.split('.')[1].toUpperCase();
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

	_renderTitle() {
		const date = formatDateTime(
			this._date,
			{format: 'full'}
		);
		return html`
		<d2l-list-item>
		<d2l-list-item-content>
		<h3 class="d2l-heading-3">Submission ${this.displayNumber}</h3>
		<div class="d2l-body-small">
		${this._renderStatus()}
		<d2l-status-indicator state="default" text="${this.evaluationState}"></d2l-status-indicator>
		${date}</div>
		</d2l-list-item-content>
		${this._addActionsForTextSubmission()}
		</d2l-list-item>`;
	}

	_renderStatus() {
		if (this.late) {
			return html`<d2l-status-indicator state="alert" text="Late" bold></d2l-status-indicator>`;
		} else {
			return html ``;
		}
	}

	_addActionsForTextSubmission() {
		if (this.submissionType === 'Text submission') {
			return html`
			<div slot="actions">
				<d2l-button-icon icon="tier1:more"></d2l-button-icon>
			</div>
			</d2l-list-item>`;
		} else {
			return html``;
		}
	}

	_renderAttachments() {
		return html`${this._attachments.map((file) => html`
			<d2l-list-item class="consistent-eval-submission-attachment-item-container">
			<d2l-list-item-content>
			<d2l-icon class="consistent-eval-submission-attachment-item" icon="tier2:${this._getIcon(file.properties.name)}"></d2l-icon>
			<div class="consistent-eval-submission-attachment-item">
				<a href="${file.properties.href}"><span>${this._getFileTitle(file.properties.name)}</span></a>
				<div slot="secondary" class="d2l-body-small">${this._getFileType(file.properties.name)}
					<d2l-icon icon="tier1:dot"></d2l-icon>${this._getReadableFileSizeString(file.properties.size)}
				</div>
			</div>
			</d2l-list-item-content>

			<div slot="actions">
				<d2l-button-icon icon="tier1:more"></d2l-button-icon>
			</div>
			</d2l-list-item>`)}`;
	}

	_renderComment() {
		const peekHeight = this.submissionType === 'File submission' ? '5em' : '8em';
		if (this._comment) {
			return html`
				<d2l-list-item><d2l-list-item-content>
				${this._renderCommentTitle()}
				<div slot="secondary"><d2l-more-less height='${peekHeight}' h-align>${unsafeHTML(this._comment)}</d2l-more-less></div>
				</d2l-list-item-content>
				</d2l-list-item>`;
		}
		return html``;
	}

	_renderCommentTitle() {
		if (this.submissionType === 'File submission') {
			return html`<div class="d2l-label-text">Comments</div>`;
		} else {
			return html``;
		}
	}

	_renderFileSubmission() {
		return html`
		${this._renderTitle()}
		<d2l-list separators="between">
		${this._renderAttachments()}
		</d2l-list>
		${this._renderComment()}
		`;
	}

	_renderTextSubmission() {
		return html`
		${this._renderTitle()}
		${this._renderComment()}
		`;
	}

	render() {
		if (this.submissionType === 'File submission') {
			return html`${this._renderFileSubmission()}`;
		} else if (this.submissionType === 'Text submission') {
			return html`${this._renderTextSubmission()}`;
		}
	}
}
customElements.define('d2l-consistent-evaluation-submission-item', ConsistentEvaluationSubmissionItem);
