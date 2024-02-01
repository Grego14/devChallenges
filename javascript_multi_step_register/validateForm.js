const d = document

const qs = s => d.querySelector(`${s}`)
const qsa = s => d.querySelectorAll(`${s}`)

const emailRegex =
	/^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/
const nameRegex = /^[a-zA-Z\s.'-]{3,}$/

export default function validateForm({form, inputs = {}, options, summary = {}, button, callback}){
	/*
	 * form -> string
	 * inputs -> object {name, min, max, regex}
	 * options -> string (every selected option will be a input.type='button') (every option will be sended to optionsList)
	 * summary -> object {name, email, optionsList !== 0}
	 * button -> string
	 * callback -> function
	*/

	if(!validateType(form, 'string') || !qs(verifyDot(form))) throw new TypeError(`${getError('selector', 'form')}`)

	if(!validateType(inputs, 'object')) throw new TypeError(`${getError('instanceOrType', 'inputs', 'object')}`)
	if(Object.keys(inputs).length === 0) throw new RangeError(`${getError('empty', 'inputs')}`)

	if(!validateType(button, 'string') || !qs(verifyDot(button))) throw new TypeError(`${getError('selector', 'button')}`)
	if(!validateType(options, 'string') || !qsa(verifyDot(options))) throw new TypeError(`${getError('selector', 'options')}`)

	if(!validateType(summary, 'object')) throw new TypeError(`${getError('instanceOrType', 'summary', 'object')}`)
	if(Object.keys(summary).length === 0) throw new RangeError(`${getError('empty', 'summary')}`)

	if(!summary.name || !summary.email || !summary.optionsList) throw new Error(`${getError('invalidProps', 'summary', 'name, email, optionsList')}`)

	for (const [key, value] of Object.entries(summary)) {
		if(!validateType(value, 'string')) throw new TypeError(`${getError('instanceOrType', `summary '${key}'`, 'string')}`)
	}

	if(callback && !validateType(callback, 'function')) throw new TypeError(`${getError('instanceOrType', 'callback', 'function')}`)
}

const errorsMessages = {
	string: 'must be a string!',
	number: 'must be a number!',
	empty: "can't be empty!",
	min: 'must be more or equal to',
	max: 'must be less or equal to',
	instanceOrType: 'must be a',
	regex: 'Does not match the requirements',
	element: 'must be a HTMLElement',
	selector: 'must be a CSS selector',
	invalidProps: 'must contain the followed props:'
}

// returns the length of characters in a string (no whitespaces)
function characters(string) {
	return string.replace(/\s/g, '').length
}

// returns the length of the username of an email (the text before @)
function verifyUsername(string) {
	return characters(string.split('@')[0])
}

function verifyDot(value) {
	if(value.startsWith('.')) return value
	return `.${value}`
}

function validateType(value, type){
	if(typeof type !== 'string') throw new TypeError(`${getError('instanceOrType', 'type', 'string')}`)
	return typeof value === type
}

function getError(error, ...props) {
	let message = errorsMessages[error]
	const propsObj = {}

	for (const [prop, value] of props.entries()) {
		propsObj[`prop${prop}`] = value
	}

	// if prop0 insert prop0 in the beggining of the message
	// if prop1 insert prop1 in the end of the message
	// if prop1, prop0 must be a valid string or a empty one
	if(propsObj?.prop0 || propsObj?.prop0 === '') {
		message = propsObj?.prop0 === '' ? message : `${propsObj?.prop0} ${message}`
		if(propsObj?.prop1) message += ` ${propsObj?.prop1}` 
	}
	return message
}
