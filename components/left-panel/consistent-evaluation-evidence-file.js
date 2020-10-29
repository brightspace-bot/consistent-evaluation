import './consistent-evaluation-evidence-top-bar.js';
import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationEvidenceFile extends LitElement {

	static get properties() {
		return {
			url: { type: String },
			token: { type: Object },
			_resizing: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-top-bar-height: 2.7rem;
			}
			iframe {
				height: calc(100% - var(--d2l-top-bar-height));
				width: 100%;
			}
			iframe[data-resizing] {
				pointer-events: none;
			}
		`;
	}

	constructor() {
		super();

		this._resizeStart = this._resizeStart.bind(this);
		this._resizeEnd = this._resizeEnd.bind(this);
		this._handleMessage = this._handleMessage.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('d2l-template-primary-secondary-resize-start', this._resizeStart);
		window.addEventListener('d2l-template-primary-secondary-resize-end', this._resizeEnd);
		window.addEventListener('message', this._handleMessage);
	}

	disconnectedCallback() {
		window.removeEventListener('d2l-template-primary-secondary-resize-start', this._resizeStart);
		window.removeEventListener('d2l-template-primary-secondary-resize-end', this._resizeEnd);
		window.removeEventListener('message', this._handleMessage);
		super.disconnectedCallback();
	}

	_handleMessage(e) {
		if (e.data.type === 'token-request') {
			return this._handleTokenRequest(e);
		} else if (e.data.type === 'annotations-update') {
			return this._handleAnnotationsUpdate(e);
		}
	}

	_handleTokenRequest(e) {
		if (typeof this.token === 'string') {
			this._postTokenResponse(e, this.token);
		} else {
			this.token().then(token => {
				this._postTokenResponse(e, token);
			});
		}
	}

	_postTokenResponse(e, token) {
		e.source.postMessage({
			type: 'token-response',
			token: token
		}, 'https://s.brightspace.com');
	}

	_handleAnnotationsUpdate(e) {
		this.dispatchEvent(new CustomEvent('d2l-consistent-eval-annotations-update', {
			composed: true,
			bubbles: true,
			detail: e.data.value
		}));
	}

	_resizeStart() {
		this._resizing = true;
	}

	_resizeEnd() {
		this._resizing = false;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-evidence-top-bar></d2l-consistent-evaluation-evidence-top-bar>
			<iframe ?data-resizing=${this._resizing}
				src="${this.url}"
				frameborder="0"
				scrolling="no"
				allow="fullscreen"
			></iframe>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-evidence-file', ConsistentEvaluationEvidenceFile);
