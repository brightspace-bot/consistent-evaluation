import './consistent-evaluation-evidence.js';
import { html, LitElement } from 'lit-element';

export class ConsistentEvaluationLeftPanel extends LitElement {

	static get properties() {
		return {
		};
	}

	constructor() {
		super();

		const qs = 'dropboxId=3&entityId=30221&fileId=79&submissionId=4&ou=123063&host=https%3A%2F%2F223f1313e448.eu.ngrok.io';

		this._iframeSrc = `http://localhost:8000?${qs}`;
		//this._iframeSrc = `//s.brightspace.com/apps/annotations-viewer/1.13.1/index.html?${qs}`;

		this._token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjRlM2VjYWY3LTYyZTAtNDdkMS05NjU1LWE5NGNhZDQxYjU2OSJ9.eyJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTkxMjg3NjE2LCJuYmYiOjE1OTEyODQwMTYsInN1YiI6IjE3NyIsInRlbmFudGlkIjoiNjE5ZjViZWEtODk4NS00ZTQxLThlYTUtMzAwZjk3NTk2ZmJiIiwiYXpwIjoiRXhwYW5kb0NsaWVudCIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiI1ZDZhM2RjYS04YTU2LTQ0NGYtYTk0Yi01M2MyNjYwZjg0YjkifQ.KDx-hRUUAOeRAEvBpHSq1yWSHlIus9PkdZ3NVY8gXaG8LGji-aIk2oYi8OvsnIUydwx2AgHwI2sQs4cEDuW4YUXiLQcj61iaibDhXxqPyxQIuIfsHe45qe5dOGx7x96hbgJaWwOS6M8EBQdXFrTOLQIPimpgWJ7fk7eSJZ6f_-BT-FlPzwartmsVO6eUeuQbw77Byfo-BcriIFsuVDoAoh_5gDUrhQB2BwanmAhOhzMCgav7ybIV9WCputni-eFj2oAwoT2GRSEzWQvPVGJJ4xLuKTNuJNEY59U1NCaGdBkHtcBWO1-oQHoUUi_1hwQr0CPQySOZLm-4_7GDijZzxQ';
	}

	render() {
		return html`
			<consistent-evaluation-evidence
				src="${this._iframeSrc}"
				token="${this._token}"
			></consistent-evaluation-evidence>
		`;
	}
}

customElements.define('consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
