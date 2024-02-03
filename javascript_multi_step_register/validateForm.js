const d = document

const qs = s => !d.querySelector(`${s}`) ? new Error(`Element with selector ${s} not found!`) : d.querySelector(`${s}`)
const qsa = s => !d.querySelectorAll(`${s}`) ? new Error(`Element with selector ${s} not found!`) : d.querySelectorAll(`${s}`)

export default function validateForm({
	form,
	inputs = {},
	options = {},
	summary = {},
	button = {},
	callback,
	cards = {},
}) {
	/*
	 * form -> string (form is a container with inputs and options)
	 * inputs ---> object (props --> name -> string, min -> number, max -> number, regex -> RegExp)
	 * options ---> object (props --> class, selected) -> string; (every option will be sended to optionsList)
	 * summary ---> object (props --> name, email, optionsList !== 0)
	 * button ---> object (props -->  (class, btnText) -> strings)
	 * cards ---> object (props -->  (className, cards) -> strings)
	 * cards.className is the class for the actual card
	 * button.btnText is the text of the button when the final card is about to be shown
	 * callback -> function
	 */

		// validations
	
		validateType({inputs, options, summary, cards}, 'object')
		emptyObj({inputs, options, summary, button, cards})

		validateType([summary.name,
			summary.email,
			summary.optionsList,
			button.class,
			button.btnText,
			form
		], 'string')

		if(!qs(verifyDot(form))) throw new Error(getError('instanceOrType', 'form', 'string'))

		// validate inputs props
		for (const [key, value] of Object.entries(inputs)) {
			validateType({singleProp: true, value: value.inputName}, 'string',)
			validateType([value.min, value.max], 'number')

			validateType({singleProp: true, value: value.regex}, 'object', RegExp, getError('instanceOrType', `(${key}.regex)`, 'RegExp'))
		}

		if (callback) validateType(callback, 'function')

		if (callback) callback({ form, inputs, options, summary, button })

		const $form = qs(verifyDot(form))
		const $button = qs(verifyDot(button.class))

		d.addEventListener('click', e => {
			buttonHandler({
				e,
				button: $button,
				cards: qsa(verifyDot(cards.cards)),
				className: cards.className,
				btnText: button.btnText,
			})
		})

		// summary must be a valid container with a template who has the following elements: name, email, optionsList
		// or summary must be a valid container with the following elements: name, email, optionsList
	 
	// template element or optionsList element
		//const templateOrList = 'content' in d.createElement('template')
		//? d.getElementById(summary.templateId)
		//: qs(verifyDot(sumary.optionsList))

		//const clone = 'content' in d.createElement('template')
		//? templateOrList.content.cloneNode(true)
		//: null

		//const $summaryName = 'content' in d.createElement('template')
		//? clone.querySelector(verifyDot(summary.name))
		//: qs(verifyDot(summary.name))

		//const $summaryEmail = 'content' in d.createElement('template')
		//? clone.querySelector(verifyDot(summary.email))
		//: qs(verifyDot(summary.email))

		//console.warn($summaryName, $summaryEmail)

		//if ('content' in d.createElement('template')) {
			//const template = d.getElementById('summary')
			//const clone = template.content.cloneNode(true)
		//console.log(clone.querySelector(verifyDot(summary.name)))
			////console.log($summaryName, '\n', $summaryEmail, '\n', $summaryList)
		//}else{
			//const list = qs(verifyDot(summary.optionsList))
		//// insert name and email inputs values to summary
		//$summaryName.value = qs(verifyDot(summary.name)).value
		//$summaryEmail.value = qs(verifyDot(summary.email)).value
		//}

}

const errorsMessages = {
	string: 'must be a string!',
	number: 'must be a number!',
	empty: "can't be empty!",
	min: 'must be more or equal to',
	max: 'must be less or equal to',
	instanceOrType: 'must be',
	regex: 'Does not match the requirements',
	element: 'must be a HTMLElement',
	selector: 'must be a CSS selector',
	invalidProps: 'must contain the followed props:',
}

function buttonHandler({ e, button, cards, className, btnText }) {
	const actualCard = Array.from(cards).find(card =>
		card.classList.contains(className)
	)
	if (e.target === button) {
		cardsHandler({
			e,
			cards,
			className,
			actualCard,
			button,
			callback: () => updateBtn({ button, btnText }),
		})
	}
}

function cardsHandler({ e, cards, className, actualCard, callback, button }) {
	if (!validateType(callback, 'function'))
		throw new TypeError(`${getError('instanceOrType', 'callback', 'function')}`)

	if (actualCard) actualCard.classList.remove(className)

	const newCard = actualCard?.nextElementSibling
	if (newCard) newCard.classList.add(className)

	if (callback && newCard === cards[cards.length - 1]) callback({ button })
	return { oldCard: actualCard, newCard }
}

function updateBtn({ button, btnText }) {
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
	if (!validateType({singleProp: true, value: value}, 'string').status)
		throw new TypeError(`${getError('instanceOrType', 'value', 'string')}`)

	if (value.startsWith('.')) return value

	return `.${value}`
}

function validateType(obj, type, instance, customError) {
	if(typeof obj !== 'object') throw new TypeError(`${getError('instanceOrType', 'obj', 'an object')}`)
	if(typeof obj === 'object' && Object.keys(obj).length === 0) throw new RangeError(`${getError('empty', 'object')}`)

	if (typeof type !== 'string')
		throw new TypeError(`${getError('instanceOrType', 'type', 'string')}`)

	if (instance && typeof instance !== 'function')
		throw new TypeError(`${getError('instanceOrType', 'instance', 'valid instance')}`)

	const output = {
		status: true,
		value: '',
	}

	const update = (v, s) => {
		output.status = s
		output.value = v
	}

		// make singleProp not iterable
		Object.defineProperty(obj, 'singleProp', { enumerable: false, value: obj.singleProp || false });

		for(const [key, value] of Object.entries(obj)){

		if(obj.singleProp){
			if(instance && !(value instanceof instance) && (typeof value !== type)){
				update(value, false)
			}else if(!instance && typeof value !== type){
				update(value, false)
			}

			if(output.status === false) throw new TypeError(customError ? customError : `${getError('instanceOrType',
				`${key} '${output.value}'`,
				`${type}${instance ? ` and ${instance}` : ''}`)}`)
			}

			if(instance && !(value instanceof instance) && (typeof value !== type)){
				update(value, false)
			}else if(!instance && typeof value !== type){
				update(value, false)
			}
		// if instance doesn't exist returns 'type' + ''; else
		// returns 'type' + ' and instance'
			if(output.status === false) throw new TypeError(customError ? customError : `${getError('instanceOrType',
			`${output.value}`,
			`${type}${instance ? ` and ${instance}` : ''}`)}`)
		}
	return output
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
	if (propsObj?.prop0 || propsObj?.prop0 === '') {
		message = propsObj?.prop0 === '' ? message : `${propsObj?.prop0} ${message}`
		if (propsObj?.prop1) message += ` ${propsObj?.prop1}`
	}
	return message
}

function emptyObj(obj){
	if(typeof obj === 'object' && Object.keys(obj).length === 0) throw new RangeError(`${getError('empty', 'object')}`)

	for (const [key, value] of Object.entries(obj)) {
		if(Object.keys(value).length === 0) throw new RangeError(`${getError('empty', key)}`)
	}
}
