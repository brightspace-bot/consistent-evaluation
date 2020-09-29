import '../../../d2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from '../../../lit-element/lit-element.js';
import { formatDate, formatTime } from '../../../@brightspace-ui/intl/lib/dateTime.js';
import { Classes } from 'd2l-hypermedia-constants';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '../../../@brightspace-ui/core/mixins/localize-mixin.js';
import { RtlMixin } from '../../../@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '../../../@brightspace-ui/core/components/inputs/input-select-styles.js';

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
				attribute: false,
				type: String
			}
		};
	}

	static get styles() {
		return [selectStyles,
			css`
				:host {
					display: inline-block;
				}
				:host([overflow]) select {
					max-width: 130px;
				}
			`
		];
	}
	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
	}

	async updated(changedProperties) {
		super.updated();

		if (changedProperties.has('submissionInfo')) {
			this._files = await this.getSubmissions();
		}

	}
	async getSubmissions() {
		if (this.submissionInfo) {
			const files = await this.submissionInfo.submissionList.map(async sub => {
				return await window.D2L.Siren.EntityStore.fetch(sub.href, this.token, false);
				return {
					href: sub.href,
					submissionFile: file.entity,
					submissionNumber: sub.href.slice(-1)
				};
			});
			return Promise.all(files);
		}

	}

	getSubmissionFiles(submission) {
		const attachments = submission.entity.getSubEntityByRel('https://assignments.api.brightspace.com/rels/attachment-list');
		let displayNum = 0;
		return attachments.entities.map(sf => {
			displayNum += displayNum;
			if (submission.entity.getSubEntityByClass(Classes.assignments.submissionComment)) {
				sf.properties.comment = submission.entity.getSubEntityByClass(Classes.assignments.submissionComment).properties.html;
			}
			sf.properties.date = submission.entity.getSubEntityByClass(Classes.assignments.submissionDate).properties.date;
			sf.properties.displayNumber = displayNum;
			return sf.properties;
		});
	}

	_onSelectChange(e) {
		if (e.target.value === 'User Submissions') {
			const event = new Event('d2l-consistent-evaluation-evidence-back-to-user-submissions', {
				composed: true,
				bubbles: true
			});
			window.dispatchEvent(event);
			return;
		}
		const submissionFile = JSON.parse(e.target.value);
		this._dispatchRenderEvidence(submissionFile);
	}

	//this is duplicated from submission item
	_dispatchRenderEvidence(sf) {
		if (sf.extension === 'txt') {
			this._dispatchRenderEvidenceTextEvent(sf);
		}
		else if (sf.fileViewer) {
			this._dispatchRenderEvidenceFileEvent(sf);
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
					date: this._formatDateTime(sf.date),
					downloadUrl: sf.href,
					content: sf.comment
				}
			},
			composed: true,
			bubbles: true
		});
		this.dispatchEvent(event);
	}

	_formatDateTime(date) {
		date = new Date(date);
		const formattedDate = (date) ? formatDate(
			date,
			{format: 'full'}) : '';
		const formattedTime = (date) ? formatTime(
			date,
			{format: 'short'}) : '';
		return `${formattedDate} ${formattedTime}`;
	}

	render() {
		return html`
        <select
		class="d2l-input-select"
		@change=${this._onSelectChange}
		>
		<option label='User Submissions' value='User Submissions' ?selected=${this.selectedItemName === 'a'}></option>
                    ${this._files && this._files.map(submission => html`
						<optgroup label=${`Submission ${submission.submissionNumber}`}>
							${this.getSubmissionFiles(submission).map(sf => html`
								<option value=${JSON.stringify(sf)} label=${sf.name} ?selected=${sf.name === this.selectedItemName}></option>
							`)}
						</optgroup>
                    `)};
        </select>
 		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-file-context', ConsistentEvaluationLcbFileContext);
