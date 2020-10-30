/* global moment:false */
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/colors/colors.js';
import './consistent-evaluation-submission-item.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Classes } from 'd2l-hypermedia-constants';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export class ConsistentEvaluationSubmissionsPage extends SkeletonMixin(LitElement) {
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
		return [super.styles, css`
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
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-view-skeleton {
				background-color: white;
				border-radius: 6px;
				margin: 0.5rem;
				padding: 0.5rem;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-item-skeleton {
				height:100%;
				width:100%;
				display:block;
				margin-top:0.5rem;
			}

			:host([skeleton]) .d2l-consistent-evaluation-submission-list-view {
				display: none;
			}

			:host([skeleton]) .d2l-consistent-evaluation-list-item-submission-skeleton {
				margin-left: 1rem;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-header-title-skeleton {
				height: 0.65rem;
				width: 5rem;
				margin-bottom:0.5rem;
				float: left;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-header-body-skeleton {
				height: 0.55rem;
				width: 7rem;
				margin-top:0.5rem;
				clear: left;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-footer-title-skeleton {
				height: 0.65rem;
				width: 6rem;
				display: block;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-file-image-skeleton {
				height: 1.8rem;
				width: 1.8rem;
				bottom:0.5rem;
				display: block;
				float:left;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-file-name-skeleton {
				height: 1rem;
				width: 12rem;
				bottom:0.5rem;
				display: block;
				margin: 0rem 0rem 0rem 0.7rem;
				float:left;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-file-information-skeleton {
				height: .8rem;
				width: 5rem;
				bottom:0.5rem;
				display: block;
				margin: 1rem 0rem 0rem 2.5rem;
				clear:left;
			}
			:host([skeleton]) .d2l-consistent-evaluation-submission-list-separator-skeleton {
				height: 0.1rem;
				width: 100%%;
				margin: 0.4rem 0rem 1.0rem 0rem;
			}
			:host([skeleton]) {
				height: 100%;
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

	_finishedLoading(e) {
		this.loadedSubmissions++;
		console.log("finished " + this.expectedSubmissions);

		if(this.skeleton === true && this.expectedSubmissions === this.loadedSubmissions) {
			this.dispatchEvent(new CustomEvent('d2l-consistent-evaluation-loading-finished', {
				composed: true,
				bubbles: true,
				detail: {
					component: 'submissions'
				}
			}));
		}
	}

	_startLoading() {
		this.loadedSubmissions = 0;
		this.expectedSubmissions = 8;
		console.log("expected " + this.expectedSubmissions);
	}

	updated(changedProperties){
		super.updated();
		console.log(changedProperties);
	}

	async _updateSubmissionEntity(submissionEntity, submissionSelfLinkHref) {
		for (let i = 0;i < this._submissionEntities.length; i++) {
			const oldSubmissionEntity = await this._submissionEntities[i].entity.getLinkByRel('self');

			if (oldSubmissionEntity.href === submissionSelfLinkHref) {
				this._submissionEntities[i].entity = submissionEntity;
				return;
			}
		}
	}

	async _toggleAction(e) {
		const fileId = e.detail.fileId;
		const actionName = e.detail.action;

		const attachmentEntity = this._getAttachmentEntity(fileId);
		if (!attachmentEntity) {
			throw new Error('Invalid entity provided for attachment');
		}

		const action = attachmentEntity.getActionByName(actionName);
		const newSubmissionEntity = await performSirenAction(this.token, action, undefined, true);

		const submissionSelfLink = newSubmissionEntity.getLinkByRel('self');
		await this._updateSubmissionEntity(newSubmissionEntity, submissionSelfLink.href) ;
		await this.requestUpdate();
	}

	_renderListItems() {
		this._startLoading();
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
							@d2l-consistent-evaluation-evidence-toggle-action=${this._toggleAction}
							@d2l-consistent-evaluation-submission-loaded=${this._finishedLoading}
						></d2l-consistent-evaluation-submission-item>`);
				} else {
					console.warn('Consistent Evaluation submission date property not found');
				}
			}
		}

		return html`${itemTemplate}`;
	}

	_renderSkeleton() {
		return html`
			<div class="d2l-consistent-evaluation-submission-list-item-skeleton" >
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-header-title-skeleton"></div>
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-header-body-skeleton"></div>
			</div>
			<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-separator-skeleton"></div>
			<div class="d2l-consistent-evaluation-submission-list-item-skeleton d2l-consistent-evaluation-list-item-submission-skeleton" >
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-file-image-skeleton"></div>
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-file-name-skeleton"></div>
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-file-information-skeleton"></div>
			</div>
			<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-separator-skeleton"></div>
			<div class="d2l-consistent-evaluation-submission-list-item-skeleton d2l-consistent-evaluation-list-item-submission-skeleton">
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-file-image-skeleton"></div>
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-file-name-skeleton"></div>
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-file-information-skeleton"></div>
			</div>
			<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-separator-skeleton"></div>
			<div class="d2l-consistent-evaluation-submission-list-item-skeleton">
				<div class="d2l-skeletize d2l-consistent-evaluation-submission-list-footer-title-skeleton"></div>
				<p class="d2l-body-compact d2l-skeletize-paragraph-2"></div>
			</div>
		`
	}

	render() {
		return html`
			<div class="d2l-consistent-evaluation-submission-list-view-skeleton" aria-hidden="${!this.skeleton}">
				${this._renderSkeleton()}
			</div>
			<div class="d2l-consistent-evaluation-submission-list-view">
				<d2l-list separators="between">
						${this._renderListItems()}
				</d2l-list>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-submissions-page', ConsistentEvaluationSubmissionsPage);
