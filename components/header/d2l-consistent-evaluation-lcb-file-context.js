import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
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
	async updated(changedProperties) {
		super.updated();

		if (changedProperties.has('submissionInfo')) {
			this._files = await this.getSubmissions();
		}

	}
	async getSubmissions() {
		if (this.submissionInfo) {
			const files = await this.submissionInfo.submissionList.map(async sub => {
				const file = await window.D2L.Siren.EntityStore.fetch(sub.href, this.token, false);
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
		const attachments = submission.submissionFile.getSubEntityByRel('https://assignments.api.brightspace.com/rels/attachment-list');
		return attachments.entities.map(sf => {
			return {
				href: sf.properties.href,
				name: sf.properties.name,
				fileViewer: sf.properties.fileViewer
			};
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
		const eventDetails = {
			name: e.target.getAttribute('data-name'),
			type: 'String',
			value: e.target.value
		};
		const event = new CustomEvent('d2l-consistent-evaluation-submission-item-selected', {
			detail: eventDetails,
			composed: true
		});
		this.dispatchEvent(event);
	}

	render() {
		return html`
        <select
		class="d2l-input-select"
		@change=${this._onSelectChange}
		>
		<option label='User Submissions' value='User Submissions'></option>
                    ${this._files && this._files.map(submission => html`
						<optgroup label=${`Submission ${submission.submissionNumber}`}>
							${this.getSubmissionFiles(submission).map(sf => html`
								<option value=${sf.href} label=${sf.name}></option>
							`)}
						</optgroup>
                    `)};
        </select>
 		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-file-context', ConsistentEvaluationLcbFileContext);
