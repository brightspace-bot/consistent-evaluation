import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationEvidence extends LitElement {

	static get properties() {
		return {
			src: { type: String },
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
				src="${this.src}"
				frameborder="0" 
				scrolling="no" 
				allowfullscreen="true" 
				allow="fullscreen"
			></iframe>
		`;
	}
}

customElements.define('consistent-evaluation-evidence', ConsistentEvaluationEvidence);
