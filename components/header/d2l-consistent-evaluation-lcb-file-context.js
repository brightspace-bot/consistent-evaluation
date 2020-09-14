import { css, html, LitElement } from 'lit-element';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

export class ConsistentEvaluationLcbFileContext extends RtlMixin(LitElement) {

	static get properties() {
		return {
			submissionInfo: {
				attribute: false,
				type: Object
			}
		};
	}

	static get styles() {
		return [selectStyles, css`
		`];
	}

	get _submissionFiles() {
		if (this.userInfo) {
			console.log(this.userInfo);
			return this.userInfo.getSubEntityByRel('first-name');
		}
		return undefined;
	}
	render() {
		const selected = this.submissionInfo;
		console.log('Submission info:' + this.submissionInfo);
		if (!this.submissionInfo) { return html``;}

		return html`
        <select
        class="d2l-input-select"
        >
                    ${this.submissionInfo.submissionList.map(gc => html`
						<option value="${gc.href}" .selected="${selected && gc.href === selected.href}">
							${gc.name}
						</option>
                    `)};
        </select>
 		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-file-context', ConsistentEvaluationLcbFileContext);
