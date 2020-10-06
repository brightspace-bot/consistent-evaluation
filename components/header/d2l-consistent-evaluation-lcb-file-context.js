import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import 'd2l-activities/components/d2l-activity-editor/d2l-activity-special-access-editor.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import { attachmentListRel, submissions } from '../controllers/constants';
import { css, html, LitElement } from 'lit-element';
import { Classes } from 'd2l-hypermedia-constants';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

export class ConsistentEvaluationLcbFileContext extends RtlMixin(LocalizeMixin(LitElement)) {

	static get properties() {
		return {
			submissionInfo: {
				attribute: false,
				type: Object
			},
			_files: {
				attribute: false,
				type: Array
			},
			selectedItemName: {
				attribute: 'selected-item-name',
				type: String
			},
			specialAccessHref: {
				attribute: 'special-access-href',
				type: String
			},
			_submissionLateness: {
				attribute: false,
				type: Number
			},
			_showDialog: {
				attribute: false,
				type: Boolean
			}
		};
	}

	static get styles() {
		return [labelStyles, selectStyles,
			css`
				:host {
					margin-left: 0.7rem;
				}
				.d2l-input-select {
					max-width: 15rem;
				}
				:host([dir="rtl"]) {
					margin-left: 0;
					margin-right: 0.7rem;
				}
			`
		];
	}

	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
	}

	constructor() {
		super();
		this._showDialog = false;
		/* global moment:false */
		moment.relativeTimeThreshold('s', 60);
		moment.relativeTimeThreshold('m', 60);
		moment.relativeTimeThreshold('h', 24);
		moment.relativeTimeThreshold('d', Number.MAX_SAFE_INTEGER);
		moment.relativeTimeRounding(Math.floor);
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('submissionInfo')) {
			this._files = await this.getSubmissions();
		}
	}

	async getSubmissions() {
		this._submissionLateness = undefined;
		if (this.submissionInfo) {
			const submissionEntities = this.submissionInfo.submissionList.map(async(sub, index) => {
				const file = await window.D2L.Siren.EntityStore.fetch(sub.href, this.token, false);
				file.submissionNumber = index + 1;
				return file;
			});
			return Promise.all(submissionEntities);
		}
	}

	getSubmissionFiles(submission) {
		const attachments = submission.entity.getSubEntityByRel(attachmentListRel);
		let displayNum = 0;
		return attachments.entities.map(sf => {
			displayNum += displayNum;
			if (submission.entity.getSubEntityByClass(Classes.assignments.submissionComment)) {
				sf.properties.comment = submission.entity.getSubEntityByClass(Classes.assignments.submissionComment).properties.html;
			}

			if (submission.entity.getSubEntityByClass(Classes.assignments.submissionDate)) {
				sf.properties.latenessTimespan = submission.entity.properties.lateTimeSpan;
			}
			// this is when the assignment was submitted
			sf.properties.date = submission.entity.getSubEntityByClass(Classes.assignments.submissionDate).properties.date;
			sf.properties.displayNumber = displayNum;
			return sf.properties;
		});
	}

	_onSelectChange(e) {
		if (e.target.value === submissions) {
			const event = new Event('d2l-consistent-evaluation-evidence-back-to-user-submissions', {
				composed: true,
				bubbles: true
			});
			this.dispatchEvent(event);
			return;
		}

		const submission = JSON.parse(e.target.value);
		if (submission.comment === undefined) {
			this._dispatchRenderEvidenceFileEvent(submission);
		} else {
			this._dispatchRenderEvidenceTextEvent(submission);
		}

		if (submission.latenessTimespan !== undefined) {
			this._submissionLateness = submission.latenessTimespan;
		} else {
			this._submissionLateness = undefined;
		}
	}

	_dispatchRenderEvidenceFileEvent(sf) {
		const event = new CustomEvent('d2l-consistent-evaluation-submission-item-render-evidence-file', {
			detail: {
				url: sf.fileViewer,
				name: sf.name
			},
			composed: true,
			bubbles: true
		});
		this.dispatchEvent(event);
	}

	_dispatchRenderEvidenceTextEvent(sf) {
		const event = new CustomEvent('d2l-consistent-evaluation-submission-item-render-evidence-text', {
			detail: {
				textSubmissionEvidence: {
					title: `${this.localize('textSubmission')} ${sf.displayNumber}`,
					name: sf.name,
					date: sf.date,
					downloadUrl: sf.href,
					content: sf.comment
				}
			},
			composed: true,
			bubbles: true
		});
		this.dispatchEvent(event);
	}

	_renderLateButton() {
		if (this.selectedItemName === submissions || !this._submissionLateness)
		{
			return html``;
		} else {
			return html`
				<d2l-button-subtle
					text="${moment.duration(Number(this._submissionLateness), 'seconds').humanize()} ${this.localize('late')}"
					icon="tier1:access-special"
					@click="${this._specialAccessClicked}"
				></d2l-button-subtle>`;
		}
	}

	_specialAccessClicked() {
		this._showDialog = true;
	}

	render() {
		return html`
			<select class="d2l-input-select" @change=${this._onSelectChange}>
				<option label=${this.localize('userSubmissions')} value=${submissions} ?selected=${this.selectedItemName === submissions}></option>
				${this._files && this._files.map(submission => html`
					<optgroup label=${this.localize('submissionNumber', 'number', submission.submissionNumber)}>
						${this.getSubmissionFiles(submission).map(sf => html`
							<option value=${JSON.stringify(sf)} label=${sf.name} ?selected=${sf.name === this.selectedItemName} class="select-option"></option>
						`)}
					</optgroup>
				`)};
			</select>
			${this._renderLateButton()}
			<d2l-dialog 
				title-text="Special Access - AssignmentName - CourseName"
				?opened="${this._showDialog}">
				
				<div class="d2l-heading-2">User - StudentName</div>
				<div class="d2l-heading-2">This should be filled with properties</div>

				<d2l-button slot="footer" primary data-dialog-action="done">Save</d2l-button>
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
 		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-file-context', ConsistentEvaluationLcbFileContext);
