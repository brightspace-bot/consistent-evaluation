import './consistent-evaluation-html-editor.js';
import './consistent-evaluation-secondary-block.js';
import './consistent-evaluation-outcomes.js';
import './consistent-evaluation-rubric.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
import 'd2l-rubric/d2l-rubric.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export default class ConsistentEvaluationPage extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			overallScore: { type: Number },
			overallScoreTwo: { type: Number },
			scores: { type: Array },
			rubricHref: { type: String },
			rubricAssessmentHref: { type: String },
			outcomesHref: { type: String },
			token: { type: String },
			rubricReadOnly: { type: Boolean },
			_richTextEditorConfig: { type: Object },
			richTextEditorDisabled: { type: Boolean },
			_htmlEditorUniqueId: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-text {
				margin-bottom: 1.5rem;
			}
			d2l-consistent-evaluation-html-editor,
			d2l-rubric,
			d2l-outcomes-level-of-achievements {
				margin-top: .75rem;
			}
			div[slot="secondary"] {
				padding-left: .75rem;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
				case 'en':
					translations = await import('../locales/en.js');
					break;
			}

			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}

		return null;
	}

	constructor() {
		super();

		this.overallScore = NaN;
		this.overallScoreTwo = NaN;
		this.scores = [];
		this.richTextEditorDisabled = false;
		this._richTextEditorConfig = {};
		this._htmlEditorUniqueId = `htmleditor-${getUniqueId()}`;
	}

	handleChange(i) {
		return (e) => {
			this.dispatchEvent(
				new CustomEvent('d2l-score-changed', {
					detail: {
						score: parseInt(e.target.value),
						i: i
					}
				}));
		};
	}

	render() {
		return html`
			<d2l-template-primary-secondary>
				<div slot="header"><h1>Hello, consistent-evaluation!</h1></div>
				<div slot="primary">
					${this.scores.map((s, i) => html`<d2l-input-text
						label=${`Question ${i + 1} Score`}
						placeholder="%"
						type="number"
						value=${s}
						min="0"
						max="100"
						@change=${this.handleChange(i)}>
					</d2l-input-text>`)}
				</div>
				<div slot="secondary">
					<div>${this.localize('overallAverage')}: ${this.overallScore}</div>
					<div>${this.localize('overallAverage')}2: ${this.overallScoreTwo}</div>

					<d2l-consistent-evaluation-html-editor
						header="${this.localize('overallFeedback')}"
						@d2l-request-provider="${this._onRequestProvider}"
						value="This is the value"
						.richtextEditorConfig="${this._richTextEditorConfig}"
						@html-editor-demo-change="${this._saveInstructionsOnChange}"
						ariaLabel="aria label"
						?disabled="${this.richTextEditorDisabled}"
					></d2l-consistent-evaluation-html-editor>

					<d2l-consistent-evaluation-rubric
						header="${this.localize('rubrics')}"
						href="${this.rubricHref}"
						assessmentHref="${this.rubricAssessmentHref}"
						token="${this.token}"
						?readonly="${this.rubricReadOnly}"
					></d2l-consistent-evaluation-rubric>

					<d2l-consistent-evaluation-outcomes
						header="${this.localize('outcomes')}"
						href=${this.outcomesHref}
						token=${this.token}
					></d2l-consistent-evaluation-outcomes>

				</div>
			</d2l-template-primary-secondary>
		`;
	}

	_onRequestProvider(e) {
		if (e.detail.key === 'd2l-provider-html-editor-enabled') {
			e.detail.provider = true;
			e.stopPropagation();
		}
	}

	_saveInstructionsOnChange() {
		console.log('save on change');
	}
}
customElements.define('d2l-consistent-evaluation-page', ConsistentEvaluationPage);
