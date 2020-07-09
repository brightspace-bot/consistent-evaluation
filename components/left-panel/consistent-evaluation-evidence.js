import { css, html, LitElement } from 'lit-element';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';

export class ConsistentEvaluationEvidence extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			url: { type: String },
			token: { type: String }
		};
	}

	static get styles() {
		return css`
			iframe {
				height: 80vh;
				width: 100%;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
	}

	constructor() {
		super();

		window.addEventListener('message', e => {
			if (e.data.type === 'token-request') {
				e.source.postMessage({
					type: 'token-response',
					token: this.token
				}, '*');
			}
		});
	}

	_dispatchBackToUserSubmissionsEvent() {
		const event = new CustomEvent('d2l-consistent-evaluation-evidence-back-to-user-submissions', {
			composed: true
		});
		this.dispatchEvent(event);
	}

	render() {
		return html`
			<a href="#" @click="${this._dispatchBackToUserSubmissionsEvent}">
				${this.localize('backToUserSubmissions')}
			</a>
			<iframe 
				src="${this.url}"
				frameborder="0" 
				scrolling="no" 
				allowfullscreen="true" 
				allow="fullscreen"
			></iframe>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-evidence', ConsistentEvaluationEvidence);
