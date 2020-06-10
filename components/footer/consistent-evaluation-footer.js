import './consistent-evaluation-footer-presentational.js';
import { html, LitElement } from 'lit-element';
import { ConsistentEvaluationFooterController } from '../controllers/FooterController.js';
import { savePublishMixin } from '../save-publish-mixin.js';

export class ConsistentEvaluationFooter extends savePublishMixin(LitElement) {

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

		this._components = ['feedback-actions'];

		this._evaluationHref = undefined;
		this.nextStudentHref = undefined;
		this._token = undefined;

		this._controller = undefined;
		this._evaluationEntity = undefined;
	}

	get evaluationHref() {
		return this._evaluationHref;
	}

	set evaluationHref(val) {
		const oldVal = this.evaluationHref;
		if (oldVal !== val) {
			this._evaluationHref = val;
			if (this._evaluationHref && this._token) {
				this._initializeController().then(() => this.requestUpdate());
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
			if (this._evaluationHref && this._token) {
				this._initializeController().then(() => this.requestUpdate());
			}
		}
	}

	async _initializeController() {
		this._controller = new ConsistentEvaluationFooterController(this._evaluationHref, this._token);
		this._evaluationEntity = await this._controller.requestEvaluationEntity();
	}

	async _onPublishClick() {
		this._evaluationEntity = await this._controller.publish(this._evaluationEntity);
	}

	_onSaveDraftClick() {
		console.log('save draft');
		this.dispatchEvent(new CustomEvent('save-draft', {
			bubbles: true,
			composed: true
		}));
	}

	async _onRetractClick() {
		this._evaluationEntity = await this._controller.retract(this._evaluationEntity);
	}

	_onUpdateClick() {
		console.log('update');
		this.dispatchEvent(new CustomEvent('update-published', {
			bubbles: true,
			composed: true
		}));
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
