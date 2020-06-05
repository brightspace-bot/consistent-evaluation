import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationEvidence extends LitElement {

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

	render() {
		return html`
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
