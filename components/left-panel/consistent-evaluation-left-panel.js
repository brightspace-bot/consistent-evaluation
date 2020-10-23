import './consistent-evaluation-evidence-file.js';
import './consistent-evaluation-evidence-text.js';
import './consistent-evaluation-submissions-page.js';
import './consistent-evaluation-outcomes-overall-achievement.js';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { fileSubmission, observedInPerson, onPaperSubmission, submissionTypesWithNoEvidence, textSubmission } from '../controllers/constants';
import { getSubmissionFiles, getSubmissions } from '../helpers/submissionsAndFilesHelpers.js';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';

function getSubmissionTypeName(type) {
	switch (type) {
		case fileSubmission:
			return 'fileSubmission';
		case textSubmission:
			return 'textSubmission';
		case observedInPerson:
			return 'observedInPerson';
		case onPaperSubmission:
			return 'onPaperSubmission';
		default:
			console.error(`Consistent-Eval: Unknown submission type "${type}"`);
	}
}

export class ConsistentEvaluationLeftPanel extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			submissionInfo: {
				attribute: false,
				type: Object
			},
			token: { type: Object },
			fileEvidenceUrl: {
				attribute: 'file-evidence-url',
				type: String
			},
			textEvidence: {
				attribute: false,
				type: Object
			},
			userProgressOutcomeHref: {
				attribute: 'user-progress-outcome-href',
				type: String
			},
			currentFileId: {
				attribute: 'current-file-id',
				type: String
			}
		};
	}

	static get styles() {
		return [bodyStandardStyles, heading2Styles, css`
			d2l-consistent-evaluation-evidence {
				overflow: hidden;
			}

			.d2l-consistent-evaluation-no-evidence {
				align-items: center;
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: center;
				margin: 0 1rem;
				text-align: center;
			}

			.d2l-consistent-evaluation-no-submissions-container {
				background: white;
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.3rem;
				box-sizing: border-box;
				margin: 1rem;
				padding: 1rem;
			}

			.d2l-consistent-evaluation-no-submissions {
				background: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.3rem;
				box-sizing: border-box;
				padding: 2rem;
				width: 100%;
			}

			d2l-consistent-evaluation-submissions-page {
				width: 100%;
			}
		`];
	}

	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
	}

	async updated(changedProperties) {
		super.updated();
		console.log(this.currentFileId);
		if ((changedProperties.has('currentFileId') || changedProperties.has('token') || changedProperties.has('submissionInfo'))
			&& this.currentFileId
			&& this.token
			&& this.submissionInfo
		) {
			await this.getFileFromId();
		} else if (changedProperties.has('currentFileId') && !this.currentFileId) {
			this.textEvidence = undefined;
			this.fileEvidenceUrl = undefined;
		}

	}

	findFile(fileId, submissions) {
		for (let i = 0; i < submissions.length; i++) {
			const submission = submissions[i];
			const files = getSubmissionFiles(submission);
			for (let j = 0; j < files.length; j++) {
				const submissionFile = files[j];
				if (submissionFile.id === fileId) {
					return submissionFile;
				}
			}
		}

	}

	async getFileFromId() {
		const submissions = await getSubmissions(this.submissionInfo, this.token);
		const currentFile = this.findFile(this.currentFileId, submissions);

		if (this.submissionInfo.submissionType === fileSubmission) {
			this.fileEvidenceUrl = currentFile.fileViewer;
			this.textEvidence = undefined;
		} else if (this.submissionInfo.submissionType === textSubmission) {
			this.fileEvidenceUrl = undefined;
			this.textEvidence = {
				title: `${this.localize('textSubmission')} ${currentFile.displayNumber}`,
				date: currentFile.date,
				downloadUrl: currentFile.href,
				content: currentFile.comment
			};
		} else {
			this.textEvidence = undefined;
			this.fileEvidenceUrl = undefined;
		}
	}

	_renderFileEvidence() {
		return html`
		<d2l-consistent-evaluation-evidence-file
			url=${this.fileEvidenceUrl}
			.token=${this.token}
		></d2l-consistent-evaluation-evidence-file>`;
	}

	_renderNoEvidenceSubmissionType() {
		return html`
		<div class="d2l-consistent-evaluation-no-evidence">
			<h2 class="d2l-heading-2">${this.localize(getSubmissionTypeName(this.submissionInfo.submissionType))}</h2>
			<p class="d2l-body-standard">${this.localize('noEvidence')}</p>
		</div>`;
	}

	_renderNoSubmissions() {
		return html`
		<div class="d2l-consistent-evaluation-no-submissions-container">
			<div class="d2l-consistent-evaluation-no-submissions d2l-body-standard">${this.localize('noSubmissions')}</div>
		</div>`;
	}

	_renderOverallAchievement() {
		return html`
			<d2l-consistent-evaluation-outcomes-overall-achievement
				href=${this.userProgressOutcomeHref}
				.token=${this.token}
			></d2l-consistent-evaluation-outcomes-overall-achievement>
		`;
	}

	_renderSubmissionList() {
		return html`
		<d2l-consistent-evaluation-submissions-page
			submission-type=${this.submissionInfo && this.submissionInfo.submissionType}
			.submissionList=${this.submissionInfo && this.submissionInfo.submissionList}
			.token=${this.token}
		></d2l-consistent-evaluation-submissions-page>`;
	}

	_renderTextEvidence() {
		return html`
		<d2l-consistent-evaluation-evidence-text
			title=${this.textEvidence.title}
			date=${this.textEvidence.date}
			download-url=${this.textEvidence.downloadUrl}
			.content=${this.textEvidence.content}
		></d2l-consistent-evaluation-evidence-text>`;
	}

	render() {
		if (this.userProgressOutcomeHref) {
			return this._renderOverallAchievement();
		}

		if (this.submissionInfo) {
			if (submissionTypesWithNoEvidence.includes(this.submissionInfo.submissionType)) {
				return this._renderNoEvidenceSubmissionType();
			}

			if (this.submissionInfo.submissionList === undefined) {
				return this._renderNoSubmissions();
			}
		}

		if (this.fileEvidenceUrl) {
			return this._renderFileEvidence();
		}

		if (this.textEvidence) {
			return this._renderTextEvidence();
		}

		return this._renderSubmissionList();
	}
}

customElements.define('d2l-consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
