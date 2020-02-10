import { css, html, LitElement } from 'lit-element';

class ConsistentEvaluationSecondaryBlock extends LitElement {
	static get properties() {
		return {
			title: {
				type: String
			}
		};
	}

	static get styles() {
		return css`
            .container {
                padding: 0px 1em;
                width: 100%;
            }
        `;
	}

	render() {
		return html`
            <div class="container">
                <h3>${this.title}</h3>
                <slot></slot>
            </div>
        `;
	}
}

customElements.define('consistent-evaluation-secondary-block', ConsistentEvaluationSecondaryBlock);
