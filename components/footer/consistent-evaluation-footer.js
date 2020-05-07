import './consistent-evaluation-footer-presentational.js';
import { html, LitElement } from 'lit-element';
import { ConsistentEvaluationFooterController } from '../controllers/FooterController.js';

export class ConsistentEvaluationFooter extends LitElement {

	static get properties() {
		return {
			evaluationHref: { type: String },
			nextStudentHref: { type: String },
			token: { type: String },
			_controller: { type: Object },
			_evaluationEntity: { type: Object }
		};
	}

	constructor() {
		super();

		this.evaluationHref = undefined;
		this.nextStudentHref = undefined;
		this.token = undefined;

		this._controller = undefined;
		this._evaluationEntity = undefined;
	}

	async updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('evaluationHref')) {
			this._controller = new ConsistentEvaluationFooterController(this.evaluationHref, this.token);
			this._evaluationEntity = await this._controller.requestEvaluationEntity();
		}
	}

	async _onPublishClick() {
		this._evaluationEntity = await this._controller.publish(this._evaluationEntity);
	}

	_onSaveDraftClick() {
		console.log('save draft');
	}

	async _onRetractClick() {
		this._evaluationEntity = await this._controller.retract(this._evaluationEntity);
	}

	_onUpdateClick() {
		console.log('update');
	}

	_onNextStudentClick() {
		this.dispatchEvent(new CustomEvent('next-student-click', {
			composed: true,
			bubbles: true
		}));
	}

	_isEntityPublished() {
		if (!this._evaluationEntity || !this._controller) {
			return false;
		}

		return this._controller.isPublished(this._evaluationEntity);
	}

	render() {
		return html`
			<d2l-consistent-evaluation-footer-presentational
				?published=${this._isEntityPublished()}
				?showNextStudent=${this.nextStudentHref !== undefined}
				@on-publish=${this._onPublishClick}				
				@on-save-draft=${this._onSaveDraftClick}
				@on-retract=${this._onRetractClick}
				@on-update=${this._onUpdateClick}
				@on-next-student=${this._onNextStudentClick}
			></d2l-consistent-evaluation-footer-presentational>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-footer', ConsistentEvaluationFooter);
