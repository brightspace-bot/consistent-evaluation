import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { saveDraftActionName, saveFeedbackActionName, saveFeedbackFieldName, saveGradeActionName } from './constants.js';
import { evaluationRel } from '../controllers/constants.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import SirenParse from 'siren-parser';

export const RightPanelControllerErrors = {
	INVALID_EVALUATION_HREF: 'evaluationHref was not defined when initializing ConsistentEvaluationFooterController',
	INVALID_TOKEN: 'token was not defined when initializing ConsistentEvaluationFooterController',
	INVALID_TYPE_EVALUATION_HREF: 'evaluationHref must be a string when initializing ConsistentEvaluationFooterController',
	INVALID_TYPE_TOKEN: 'token must be a string when initializing ConsistentEvaluationFooterController',
	ERROR_FETCHING_ENTITY: 'Error while fetching evaluation entity.',
	INVALID_FEEDBACK_TEXT: 'feedback text must be a string (empty string permitted) to update feedback text.',
	FEEDBACK_MUST_HAVE_ENTITY: 'entity must be provided with the feedback to update feedback.',
	ACTION_NOT_FOUND: (actionName) => `Could not find the ${actionName} action from the evaluation entity.`,
	FIELD_IN_ACTION_NOT_FOUND: (actionName, fieldName) => `Expected the ${actionName} action to have a ${fieldName} field.`
};

export class RightPanelController {
	constructor(evaluationHref, token) {
		if (!evaluationHref) {
			throw new Error(RightPanelControllerErrors.INVALID_EVALUATION_HREF);
		}

		if (typeof evaluationHref !== 'string') {
			throw new Error(RightPanelControllerErrors.INVALID_TYPE_EVALUATION_HREF);
		}

		if (!token) {
			throw new Error(RightPanelControllerErrors.INVALID_TOKEN);
		}

		if (typeof token !== 'string') {
			throw new Error(RightPanelControllerErrors.INVALID_TYPE_TOKEN);
		}

		this.evaluationHref = evaluationHref;
		this.token = token;
	}

	async _requestEvaluationEntity(bypassCache = false) {
		return await window.D2L.Siren.EntityStore.fetch(this.evaluationHref, this.token, bypassCache);
	}

	async requestEvaluationEntity(bypassCache = false) {
		const response = await this._requestEvaluationEntity(bypassCache);

		if (!response || !response.entity) {
			throw new Error(RightPanelControllerErrors.ERROR_FETCHING_ENTITY);
		}

		const evaluationEntity = response.entity;

		return evaluationEntity;
	}

	async requestFeedbackEntity() {
		const response = await this.requestEvaluationEntity();
		const feedbackEntity = response.getSubEntityByRel('feedback');
		return feedbackEntity;
	}

	async requestGradeEntity() {
		const response = await this.requestEvaluationEntity();
		const gradeEntity = response.getSubEntityByRel('grade');
		return gradeEntity;
	}

	async saveFeedbackTransient(feedbackText, entity) {
		if (typeof feedbackText !== 'string') {
			throw new Error(RightPanelControllerErrors.INVALID_FEEDBACK_TEXT);
		}
		if (!entity) {
			throw new Error(RightPanelControllerErrors.FEEDBACK_MUST_HAVE_ENTITY);
		}
		if (!entity.hasActionByName(saveFeedbackActionName)) {
			throw new Error(RightPanelControllerErrors.ACTION_NOT_FOUND(saveFeedbackActionName));
		}

		const saveFeedbackAction = entity.getActionByName(saveFeedbackActionName);

		if (!saveFeedbackAction.hasFieldByName(saveFeedbackFieldName)) {
			throw new Error(RightPanelControllerErrors.FIELD_IN_ACTION_NOT_FOUND(saveFeedbackAction.name, saveFeedbackFieldName));
		}
		console.log('saveFeedbackTransient');

		const field = saveFeedbackAction.getFieldByName(saveFeedbackFieldName);
		field.value = feedbackText;

		return await performSirenAction(this.token, saveFeedbackAction, [field], true);
	}

	async saveGradeTransient(grade, entity) {
		// add errors for checking grade
		if (!entity) {
			throw new Error(RightPanelControllerErrors.FEEDBACK_MUST_HAVE_ENTITY);
		}
		if (!entity.hasActionByName(saveGradeActionName)) {
			throw new Error(RightPanelControllerErrors.ACTION_NOT_FOUND(saveGradeActionName));
		}

		const saveGradeAction = entity.getActionByName(saveGradeActionName);

		if (!saveGradeAction.hasFieldByName(saveFeedbackFieldName)) {
			throw new Error(RightPanelControllerErrors.FIELD_IN_ACTION_NOT_FOUND(saveGradeAction.name, saveFeedbackFieldName));
		}
		console.log('savegradetransient not actually writing to db');

		const field = saveGradeAction.getFieldByName(saveFeedbackFieldName);
		field.value = grade;

		return await performSirenAction(this.token, saveGradeAction, [field], true);
	}

	async saveEvaluation(entity) {
		if (!entity) {
			throw new Error(RightPanelControllerErrors.FEEDBACK_MUST_HAVE_ENTITY);
		}
		if (!entity.hasActionByName(saveDraftActionName)) {
			throw new Error(RightPanelControllerErrors.ACTION_NOT_FOUND(saveDraftActionName));
		}

		const saveDraftAction = entity.getActionByName(saveDraftActionName);

		return await performSirenAction(this.token, saveDraftAction, [], true);
	}

	async updateEvaluation(entity) {
		if (!entity) {
			throw new Error(RightPanelControllerErrors.FEEDBACK_MUST_HAVE_ENTITY);
		}
		if (!entity.hasActionByName(saveDraftActionName)) {
			throw new Error(RightPanelControllerErrors.ACTION_NOT_FOUND(saveDraftActionName));
		}

		const saveDraftAction = entity.getActionByName(saveDraftActionName);

		return await performSirenAction(this.token, saveDraftAction, [], true);
	}

	// _performSirenAction(action, fields, tokenValue) {
	// 	if (!action) {
	// 		return Promise.reject(new Error('No action given'));
	// 	}

	// 	const headers = new Headers();
	// 	tokenValue && headers.append('Authorization', `Bearer ${  tokenValue}`);

	// 	let body;

	// 	if (fields) {
	// 		fields = this._appendHiddenFields(action, fields);
	// 	} else {
	// 		fields = this._getSirenFields(action);
	// 	}

	// 	const url = this._getEntityUrl(action, fields);

	// 	if (action.type.indexOf('json') !== -1) {
	// 		const json = {};
	// 		for (let i = 0; i < fields.length; i++) {
	// 			const field = fields[i];
	// 			json[field.name] = field.value;
	// 		}
	// 		headers.set('Content-Type', action.type);
	// 		body = JSON.stringify(json);
	// 	} else if (action.method !== 'GET' && action.method !== 'HEAD') {
	// 		body = this._createFormData(fields);
	// 	}

	// 	const token = tokenValue;

	// 	return  this._fetch(url.href, {
	// 		method: action.method,
	// 		body: body,
	// 		headers: headers
	// 	})
	// 		.then(result => {
	// 			console.log(result);
	// 			const linkRequests = [];
	// 			if (result.links) {
	// 				result.links.forEach(link => {
	// 					linkRequests.push(window.D2L.Siren.EntityStore.fetch(link.href, token, true));
	// 				});
	// 			}
	// 			const entity = result.body ? SirenParse(result.body) : null;
	// 			return Promise.all(linkRequests).then(() => {
	// 				if (!entity) {
	// 					return window.D2L.Siren.EntityStore.remove(url.href, token);
	// 				}
	// 				return window.D2L.Siren.EntityStore.update(url.href, token, entity);
	// 			});
	// 		});
	// }

	// _appendHiddenFields(action, fields) {
	// 	if (action.fields && action.fields.forEach) {
	// 		action.fields.forEach((field) => {
	// 			if (field.type === 'hidden' && field.value !== undefined) {
	// 				fields.push({ name: field.name, value: field.value });
	// 			}
	// 		});
	// 	}
	// 	return fields;
	// }
	// _getSirenFields(action) {
	// 	const url = new URL(action.href, window.location.origin);
	// 	const fields = [];
	// 	if (action.method === 'GET' || action.method === 'HEAD') {
	// 		for (const param in url.searchParams.entries()) {
	// 			fields.push({ name: param[0], value: param[1] });
	// 		}
	// 	}

	// 	if (action.fields && action.fields.forEach) {
	// 		action.fields.forEach(field => {
	// 			if (field.value === undefined) {
	// 				return;
	// 			}
	// 			// if the field is specified multiple times, assume it is intentional
	// 			fields.push({ name: field.name, value: field.value });
	// 		});
	// 	}
	// 	return fields;
	// }

	// _getEntityUrl(action, fields) {
	// 	if (!action) {
	// 		return null;
	// 	}

	// 	let url = new URL(action.href, window.location.origin);
	// 	if (action.method === 'GET' || action.method === 'HEAD') {
	// 		const params = this._createURLSearchParams(fields);
	// 		url = new URL(`${url.pathname}?${params.toString()}`, url.origin);
	// 	}

	// 	return url;
	// }

	// _createURLSearchParams(fields) {
	// 	const sequence = [];
	// 	for (let i = 0; i < fields.length; i++) {
	// 		const field = fields[i];
	// 		sequence.push([field.name, field.value]);
	// 	}

	// 	return new URLSearchParams(sequence);
	// }

	// _createFormData(fields) {
	// 	const formData = new FormData();
	// 	for (let i = 0; i < fields.length; i++) {
	// 		console.log(i, fields[i].name, fields[i].value);
	// 		formData.append(fields[i].name, fields[i].value);
	// 	}
	// 	console.log('formdata', formData);
	// 	return formData;
	// }

	// _fetch(href, opts) {
	// 	return window.d2lfetch.fetch(href, opts)
	// 		.then(resp => {
	// 			if (!resp.ok) {
	// 				const errMsg = `${resp.statusText  } response executing ${  opts.method  } on ${  href  }.`;
	// 				return resp.json().then(data => {
	// 					throw { json: data, message: errMsg };
	// 				}, data => {
	// 					throw { string: data, message: errMsg };
	// 				});
	// 			}
	// 			const linkHeader = resp.headers ? resp.headers.get('Link') : null;
	// 			let links;
	// 			if (linkHeader) {
	// 				links = window.D2L.Siren.EntityStore.parseLinkHeader(linkHeader);
	// 			}
	// 			if (resp.status === 204) {
	// 				return {
	// 					body: null,
	// 					links: links
	// 				};
	// 			}
	// 			return resp.json().then(body => {
	// 				return {
	// 					body: body,
	// 					links: links
	// 				};
	// 			});
	// 		});
	// }
}
