import './consistent-evaluation-feedback-presentational.js';
import { html, LitElement } from 'lit-element';
import { ConsistentEvaluationFeedbackController } from '../controllers/ConsistentEvaluationFeedbackController.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import SirenParse from 'siren-parser';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

class ConsistentEvaluationFeedback extends LitElement {
	static get properties() {
		return {
			href: { type: String },
			token: { type: String }
		};
	}

	constructor() {
		super();

		this._href = undefined;
		this._token = undefined;
		this._lastUpdated = undefined;

		this._debounceJobs = {};
		this._feedbackEntity = {};
		this._feedbackText = '';
		this._richTextEditorConfig = {};
		this._evaluation = undefined;
		this._currentStateHash = '';
	}

	get href() {
		return this._href;
	}

	set href(val) {
		const oldVal = this.href;
		if (oldVal !== val) {
			this._href = val;
			if (this._href && this._token) {
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
			if (this._href && this._token) {
				this._initializeController().then(() => this.requestUpdate());
			}
		}
	}

	set lastUpdated(newDate) {
		if (newDate) {
			const oldVal = this._lastUpdated;
			if (oldVal !== newDate) {
				this._saveFeedback();
				this._lastUpdated = newDate;
				this.requestUpdate('lastUpdated', oldVal);
			}
		}
	}

	async _initializeController() {
		this._controller = new ConsistentEvaluationFeedbackController(this._href, this._token);

		this._feedbackEntity = await this._controller.requestFeedback();
		this._evaluation = await this._controller.evalEntity();
		this._feedbackText = this._feedbackEntity.properties.text;
	}

	_saveFeedback() {
		console.log('_saveFeedback() hitting db');
		console.log(this._evaluation);
		this._controller.saveFeedbackText(this._feedbackText, this._evaluation);
	}

	_saveOnFeedbackChange(e) {
		const feedback = e.detail.content;

		this._debounceJobs.feedback = Debouncer.debounce(
			this._debounceJobs.feedback,
			timeOut.after(500),
			() => this._saveTransient(feedback)
		);
	}

	async _saveTransient(feedbackText) {
		console.log('_saveTransient not actually writing to db');

		this._feedbackText = feedbackText;
		const action = this._feedbackEntity.getActionByName('SaveFeedback');
		const field = action.getFieldByName('feedback');
		field.value = feedbackText;
		window.D2L.Siren.EntityStore.getToken(this.token)
			.then((resolved) => {
				const tokenValue = resolved.tokenValue;
				this._performSirenAction(action, [field], tokenValue);
			});
		// Method below would've used performSirenAction
		// this._controller.updateFeedbackText(this._feedbackText, this._feedbackEntity);
	}

	_performSirenAction(action, fields, tokenValue) {
		if (!action) {
			return Promise.reject(new Error('No action given'));
		}

		const headers = new Headers();
		tokenValue && headers.append('Authorization', `Bearer ${  tokenValue}`);

		let body;

		if (fields) {
			fields = this._appendHiddenFields(action, fields);
		} else {
			fields = this._getSirenFields(action);
		}

		const url = this._getEntityUrl(action, fields);

		if (action.type.indexOf('json') !== -1) {
			const json = {};
			for (let i = 0; i < fields.length; i++) {
				const field = fields[i];
				json[field.name] = field.value;
			}
			headers.set('Content-Type', action.type);
			body = JSON.stringify(json);
		} else if (action.method !== 'GET' && action.method !== 'HEAD') {
			body = this._createFormData(fields);
		}

		const token = tokenValue;

		return  this._fetch(url.href, {
			method: action.method,
			body: body,
			headers: headers
		})
			.then(result => {
				const linkRequests = [];
				if (result.links) {
					console.log('resultlinks', result.links);
					result.links.forEach(link => {
						console.log('link', link);
						this.href = link.href;
						linkRequests.push(window.D2L.Siren.EntityStore.fetch(link.href, token, true));
					});
				}
				const entity = result.body ? SirenParse(result.body) : null;
				return Promise.all(linkRequests).then(() => {
					if (!entity) {
						return window.D2L.Siren.EntityStore.remove(url.href, token);
					}
					return window.D2L.Siren.EntityStore.update(url.href, token, entity);
				});
			});
	}

	_appendHiddenFields(action, fields) {
		if (action.fields && action.fields.forEach) {
			action.fields.forEach((field) => {
				if (field.type === 'hidden' && field.value !== undefined) {
					fields.push({ name: field.name, value: field.value });
				}
			});
		}
		return fields;
	}
	_getSirenFields(action) {
		const url = new URL(action.href, window.location.origin);
		const fields = [];
		if (action.method === 'GET' || action.method === 'HEAD') {
			for (const param in url.searchParams.entries()) {
				fields.push({ name: param[0], value: param[1] });
			}
		}

		if (action.fields && action.fields.forEach) {
			action.fields.forEach(field => {
				if (field.value === undefined) {
					return;
				}
				// if the field is specified multiple times, assume it is intentional
				fields.push({ name: field.name, value: field.value });
			});
		}
		return fields;
	}

	_getEntityUrl(action, fields) {
		if (!action) {
			return null;
		}

		let url = new URL(action.href, window.location.origin);
		if (action.method === 'GET' || action.method === 'HEAD') {
			const params = this._createURLSearchParams(fields);
			url = new URL(`${url.pathname}?${params.toString()}`, url.origin);
		}

		return url;
	}

	_createURLSearchParams(fields) {
		const sequence = [];
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			sequence.push([field.name, field.value]);
		}

		return new URLSearchParams(sequence);
	}

	_createFormData(fields) {
		const formData = new FormData();
		for (let i = 0; i < fields.length; i++) {
			formData.append(fields[i].name, fields[i].value);
		}
		return formData;
	}

	_fetch(href, opts) {
		return window.d2lfetch.fetch(href, opts)
			.then(resp => {
				if (!resp.ok) {
					const errMsg = `${resp.statusText  } response executing ${  opts.method  } on ${  href  }.`;
					return resp.json().then(data => {
						throw { json: data, message: errMsg };
					}, data => {
						throw { string: data, message: errMsg };
					});
				}
				const linkHeader = resp.headers ? resp.headers.get('Link') : null;
				let links;
				if (linkHeader) {
					links = window.D2L.Siren.EntityStore.parseLinkHeader(linkHeader);
				}
				if (resp.status === 204) {
					return {
						body: null,
						links: links
					};
				}
				return resp.json().then(body => {
					return {
						body: body,
						links: links
					};
				});
			});
	}

	render() {
		return html`
			<d2l-consistent-evaluation-feedback-presentational
				canEditFeedback
				feedbackText="${this._feedbackText}"
				href="${this._href}"
				.richtextEditorConfig="${this._richTextEditorConfig}"
				@d2l-activity-text-editor-change="${this._saveOnFeedbackChange}"
				.token="${this._token}"
			></d2l-consistent-evaluation-feedback-presentational>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-feedback', ConsistentEvaluationFeedback);
