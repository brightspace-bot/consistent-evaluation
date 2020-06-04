import { html, LitElement } from 'lit-element';

export class ConsistentEvaluationEvidence extends LitElement {

	static get properties() {
		return {
			src: { type: String },
			token: { type: String }
		};
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
				style="height:100vh; width:100vw;" 
				frameborder="0" 
				scrolling="no" 
				allowfullscreen="true" 
				allow="fullscreen"
			></iframe>
		`;
	}
}

customElements.define('consistent-evaluation-evidence', ConsistentEvaluationEvidence);
