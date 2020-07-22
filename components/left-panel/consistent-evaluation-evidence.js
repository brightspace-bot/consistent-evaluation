import '@brightspace-ui/core/components/button/button-subtle.js';
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
			.d2l-consistent-evaluation-evidence-top-bar {
				height: 2.7rem;
			}
			iframe {
				height: calc(100% - 2.7rem);
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
				}, 'http://s.brightspace.com');
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
			<div class="d2l-consistent-evaluation-evidence-top-bar">
				<d2l-button-subtle 
					text="${this.localize('backToUserSubmissions')}" 
					icon="tier1:chevron-left"
					@click="${this._dispatchBackToUserSubmissionsEvent}"
				></d2l-button-subtle>
			</div>
			<iframe 
				src="${this.url}"
				frameborder="0" 
				scrolling="no" 
				?allowfullscreen="true" 
				allow="fullscreen"
			></iframe>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-evidence', ConsistentEvaluationEvidence);
