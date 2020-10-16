import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/colors/colors.js';
import './consistent-evaluation-submission-item.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { toggleFlagActionName, toggleIsReadActionName } from '../controllers/constants.js';
import { Classes } from 'd2l-hypermedia-constants';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';

export class ConsistentEvaluationSubmissionsPage extends LitElement {
	static get properties() {
		return {
			submissionList: {
				attribute: false,
				type: Array
			},
			submissionType: {
				attribute: 'submission-type',
				type: String
			},
			token: {
				type: Object
			}
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: var(--d2l-color-sylvite);
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-consistent-evaluation-submission-item {
				margin: 0.5rem;
				padding: 0.5rem;
			}
		`;
	}

	constructor() {
		super();
		this._submissionList = [];
		this._token = undefined;
		this._submissionEntities = [];
		/* global moment:false */
		moment.relativeTimeThreshold('s', 60);
		moment.relativeTimeThreshold('m', 60);
		moment.relativeTimeThreshold('h', 24);
		moment.relativeTimeThreshold('d', Number.MAX_SAFE_INTEGER);
		moment.relativeTimeRounding(Math.floor);
	}

	get submissionList() {
		return this._submissionList;
	}

	set submissionList(val) {
		const oldVal = this.submissionList;
		if (oldVal !== val) {
			this._submissionList = val;
			if (this._submissionList && this._token) {
				this._initializeSubmissionEntities().then(() => this.requestUpdate());
			}
		}
	}
	get token() {
		return this._token;
	}

	set token(val) {
		const oldVal = this.token;
		if (oldVal !== val) {
			this._token = val;
			if (this._submissionList && this._token) {
				this._initializeSubmissionEntities().then(() => this.requestUpdate());
			}
		}
	}

	async _initializeSubmissionEntities() {
		this._submissionEntities = [];
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
		const byPassCache = true;
		return await window.D2L.Siren.EntityStore.fetch(submissionHref, this._token, byPassCache);
	}

	_getComment(submissionEntity) {
		if (submissionEntity.getSubEntityByClass(Classes.assignments.submissionComment)) {
			return submissionEntity.getSubEntityByClass(Classes.assignments.submissionComment).properties.html;
		}
		return '';
	}

	_getAttachments(submissionEntity) {
		const attachmentsListEntity = submissionEntity.getSubEntityByClass(Classes.assignments.attachmentList);
		if (attachmentsListEntity) {
			return attachmentsListEntity.getSubEntitiesByClass(Classes.assignments.attachment);
		}
		return [];
	}

	_getAttachmentEntity(fileId) {
		for (let i = 0;i < this._submissionEntities.length; i++) {
			const attachments = this._getAttachments(this._submissionEntities[i].entity);
			for (let y = 0;y < attachments.length; y++) {
				if (attachments[y].properties.id === fileId) {
					return attachments[y];
				}
			}
		}
		return null;
	}

	_updateAttachmentEntity(attachmentEntity) {
		for (let i = 0;i < this._submissionEntities.length; i++) {
			const attachments = this._getAttachments(this._submissionEntities[i].entity);
			for (let y = 0;y < attachments.length; y++) {
				if (attachments[y].properties.id === attachmentEntity.properties.id) {
					attachments[y] = attachmentEntity;
					for (let e = 0;e < this._submissionEntities[i].entity.entities.length; e++) {
						if (this._submissionEntities[i].entity.entities[e].class.includes(Classes.assignments.attachmentList)) {
							this._submissionEntities[i].entity.entities[e].entities = attachments;
							break;
						}
					}
					return;
				}
			}
		}
	}

	async _toggleFileIsReadStatus(e) {
		const fileId = e.detail.fileId;
		const attachmentEntity = this._getAttachmentEntity(fileId);
		if (!attachmentEntity) {
			throw new Error('Invalid entity provided for attachment');
		}

		const action = attachmentEntity.getActionByName(toggleIsReadActionName);
		await performSirenAction(this.token, action, undefined, true);

		attachmentEntity.properties.read = !attachmentEntity.properties.read;

		this._updateAttachmentEntity(attachmentEntity) ;
		await this.requestUpdate();
	}

	async _toggleFileFlagStatus(e) {
		const fileId = e.detail.fileId;
		const attachmentEntity = this._getAttachmentEntity(fileId);
		if (!attachmentEntity) {
			throw new Error('Invalid entity provided for attachment');
		}

		const action = attachmentEntity.getActionByName(toggleFlagActionName);
		await performSirenAction(this.token, action, undefined, true);

		attachmentEntity.properties.flagged = !attachmentEntity.properties.flagged;

		this._updateAttachmentEntity(attachmentEntity) ;
		//await this._initializeSubmissionEntities();
		await this.requestUpdate();
	}

	_renderListItems() {
		const itemTemplate = [];
		for (let i = 0; i < this._submissionEntities.length; i++) {
			if (this._submissionEntities[i].entity) {
				const submissionEntity = this._submissionEntities[i].entity;
				if (submissionEntity.getSubEntityByClass(Classes.assignments.submissionDate)) {
					const submissionDate = submissionEntity.getSubEntityByClass(Classes.assignments.submissionDate).properties.date;
					const evaluationState = submissionEntity.properties.evaluationStatus;
					const latenessTimespan = submissionEntity.properties.lateTimeSpan;
					itemTemplate.push(html`
						<d2l-consistent-evaluation-submission-item
							date-str=${submissionDate}
							display-number=${this._submissionEntities.length - i}
							evaluation-state=${evaluationState}
							lateness=${moment.duration(Number(latenessTimespan), 'seconds').humanize()}
							submission-type=${this.submissionType}
							comment=${this._getComment(submissionEntity)}
							.attachments=${this._getAttachments(submissionEntity)}
							?late=${latenessTimespan !== undefined}
							@d2l-consistent-evaluation-evidence-toggle-file-read=${this._toggleFileIsReadStatus}
							@d2l-consistent-evaluation-evidence-toggle-file-flag=${this._toggleFileFlagStatus}
						></d2l-consistent-evaluation-submission-item>`);
				} else {
					console.warn('Consistent Evaluation submission date property not found');
				}
			}
		}
		return html`${itemTemplate}`;
	}

	render() {
		return html`<d2l-list separators="between">
				${this._renderListItems()}
				</d2l-list>`;
	}
}

customElements.define('d2l-consistent-evaluation-submissions-page', ConsistentEvaluationSubmissionsPage);
