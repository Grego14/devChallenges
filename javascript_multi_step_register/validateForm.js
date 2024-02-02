const d = document

const qs = s => d.querySelector(`${s}`)
const qsa = s => d.querySelectorAll(`${s}`)

export default function validateForm({form, inputs = {}, options, summary = {}, button = {}, callback, cards = {},}){
	/*
	 * form -> string (form is a container with inputs and options)
	 * inputs ---> object (props --> name -> string, min -> number, max -> number, regex -> RegExp)
	 * options -> string (every selected option will be a input.type='button') (every option will be sended to optionsList)
	 * summary ---> object (props --> name, email, optionsList !== 0)
	 * button ---> object (props -->  (class, btnText) -> strings)
	 * btnText is the text of the button when the final card is about to be shown
	 * callback -> function
	*/

	if(!validateType(form, 'string') || !qs(verifyDot(form))) throw new TypeError(`${getError('selector', 'form')}`)

	if(!validateType(inputs, 'object')) throw new TypeError(`${getError('instanceOrType', 'inputs', 'object')}`)
	if(Object.keys(inputs).length === 0) throw new RangeError(`${getError('empty', 'inputs')}`)

	if(!validateType(button, 'object')) throw new TypeError(`${getError('instanceOrType', 'object')}`)
	if(Object.keys(button).length === 0) throw new RangeError(`${getError('empty', 'button')}`)

	if(!validateType(options, 'string') || !qsa(verifyDot(options))) throw new TypeError(`${getError('selector', 'options')}`)

	if(!validateType(summary, 'object')) throw new TypeError(`${getError('instanceOrType', 'summary', 'object')}`)
	if(Object.keys(summary).length === 0) throw new RangeError(`${getError('empty', 'summary')}`)

	if(!summary.name || !summary.email || !summary.optionsList) throw new Error(`${getError('invalidProps', 'summary', 'name, email, optionsList')}`)

	// validate button props
	for (const [key, value] of Object.entries(button)) {
		// next step: make the first argument of validateType be an array to avoid making all these lines
		// if every prop is a 'value'
		if(!validateType(button.class, 'string')) throw new TypeError(`${getError('instanceOrType', `(${key}.class)`, 'string')}`)
		if(!validateType(button.btnText, 'string')) throw new TypeError(`${getError('instanceOrType', `(${ke}.btnText)`, 'string')}`)
	}

	// validate inputs props
	for (const [key, value] of Object.entries(inputs)) {
		if(!validateType(value.name, 'string')) throw new TypeError(`${getError('instanceOrType', `(${key}.name)`, 'string')}`)
		if(!validateType(value.min, 'number')) throw new TypeError(`${getError('instanceOrType', `(${key}.min)`, 'number')}`)
		if(!validateType(value.max, 'number')) throw new TypeError(`${getError('instanceOrType', `(${key}.max)`, 'number')}`)
		if(!(value.regex instanceof RegExp)) throw new TypeError(`${getError('instanceOrType', `(${key}.regex)`, 'RegExp')}`)
	}

	// validate summary props
	for (const [key, value] of Object.entries(summary)) {
		if(!validateType(value, 'string')) throw new TypeError(`${getError('instanceOrType', `summary '${key}'`, 'string')}`)
	}

	if(callback && !validateType(callback, 'function')) throw new TypeError(`${getError('instanceOrType', 'callback', 'function')}`)

	if(callback) callback({form, inputs, options, summary, button})

	const $form = qs(verifyDot(form))
	const $button = qs(verifyDot(button.class))
	
	d.addEventListener('click', e => {
		buttonHandler({e,
			button: $button, 
			cards: qsa(verifyDot(cards.cards)),
			className: cards.className,
			btnText: button.btnText })
	})

	// summary must be a valid container with a template who has the following elements: name, email, optionsList
	// or summary must be a valid container with the following elements: name, email, optionsList

	if('content' in d.createElement('template')){
		const template = d.getElementById('summary')
		const clone = template.content.cloneNode(true)
		//const $summaryName = clone.qs()
		const $summaryName = clone.querySelector(verifyDot(summary.name))
		const $summaryEmail = clone.querySelector(verifyDot(summary.email))
		const $summaryList = clone.querySelector(verifyDot(summary.optionsList))
		console.log($summaryName, '\n',$summaryEmail,'\n', $summaryList)
	}
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

function buttonHandler({e,button, cards, className, btnText}){
	const actualCard = Array.from(cards).find(card => card.classList.contains(className))
	if(e.target === button){
		cardsHandler({e, cards, className, actualCard, button, callback: updateBtn({button, btnText})})
	}
}

function cardsHandler({e, cards, className, actualCard, callback, button}){

	if(!validateType(callback, 'function')) throw new TypeError(`${getError('instanceOrType', 'callback', 'function')}`)

	if(actualCard) actualCard.classList.remove(className)

	const newCard = actualCard?.nextElementSibling
	if(newCard) newCard.classList.add(className)

	if(callback && newCard === cards[cards.length - 1]) callback({button})
	return {oldCard: actualCard, newCard}
}

function updateBtn({button, btnText}){
	button.textContent = btnText
}

// validation functions

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
