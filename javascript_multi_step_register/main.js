const d = document

const qs = s => d.querySelector(`${s}`)
const qsa = s => d.querySelectorAll(`${s}`)
const _ = (...args) => console.log(...args)

const form = qs('.wrapper__form')
const inputs = qsa('.wrapper__input')
const button = qs('.wrapper__button')
const steps = qsa('.wrapper__step')

const emailRegex =
	/^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/
const nameRegex = /^[a-zA-Z\s.'-]{3,}$/

const errorsMessages = {
	string: 'must be a string!',
	number: 'must be a number!',
	empty: "can't be empty!",
	function: 'must be a function!',
	object: 'must be a object!',
	min: 'must be more or equal to',
	max: 'must be less or equal to',
	invalidRegex: 'must be a valid RegExp',
	emailUsernameMin: 'username must be',
	emailUsernameMax: 'username must be',
	regex: 'Does not match the requirements',
	element: 'must be a HTMLElement',
}

// returns the length of characters in a string (no whitespaces)
function characters(string) {
	return string.replace(/\s/g, '').length
}

// returns the length of the username of an email (the text before @)
function verifyUsername(string) {
	return characters(string.split('@')[0])
}

function getAttr(element, attr, instance) {
	if (!validateInstance(element, instance))
		throw new Error(`${getError('element', 'element', instance.name)}`)

	return element.getAttribute(attr) ? element.getAttribute(attr) : false
}

function getError(error, ...props) {
	let message = errorsMessages[error]
	const propsObj = {}

	for (const [prop, value] of props.entries()) {
		propsObj[`prop${prop}`] = value
	}

	if(propsObj?.prop0 || propsObj?.prop0 === '') {
		message = message.replace(message.match(/^/)[0], `${propsObj?.prop0 === '' ? '' : `${propsObj?.prop0} `}`)
		if(propsObj?.prop1) message = message.replace(message.match(/[^\s]+$/)[0], `${propsObj?.prop1}`)
	}
	return message
}

// returns true if the type of the value is the same as the type
function validateType(value, type) {
	return typeof value !== type ? false : true
}

function classHandler(element, status) {
	if (status === false) {
		element.classList.add('input--error')
	} else if (status === true) {
		element.classList.remove('input--error')
	}
}

function validateLength(value, min, max, email, regex) {
	const realValue = !email ? characters(value) : verifyUsername(value)

	const output = {
		status: true,
		error: '',
	}

	if (realValue === 0 && value === '') {
		output.status = false
		output.error = getError('empty', 'value')
	} else if (realValue !== 0 && value !== '') {
		if (!email) {
			if (realValue < min) {
				output.status = false
				output.error = `${getError('min')} ${min} characters`
			} else if (realValue > max) {
				output.status = false
				output.error = `${getError('max')} ${max} characters`
			} else if (
				realValue > min &&
				realValue < max &&
				!validateRegex(value, regex)
			) {
				output.status = false
				output.error = `${getError('regex')}`
			}
		} else if (email) {
			// min is the length of the username (the text before @) if email === true
			if (realValue > min) {
				output.status = false
				output.error = `${getError(
					'emailUsernameMin',
				)} ${min} or less characters`
			} else if (realValue > max) {
				output.status = false
				output.error = `${getError(
					'emailUsernameMax',
				)} ${max} or less characters`
			} else if (!validateRegex(value, regex)) {
				output.status = false
				output.error = `${getError('regex')}`
			}
		}
	}
	return output
}

function validateInstance(value, instance) {
	return value instanceof instance
}

function validateRegex(value, regex) {
	return regex.test(value)
}

function validateElementOrClass({value, isClass, warn = true}) {
	// returns 'value' or '.value'
	const realValue = validateType(value, 'string') && !value.startsWith('.') ? `.${value}` : value

	if (!validateInstance(realValue, HTMLElement) && !qs(realValue)) {
		if(warn){
			console.warn(
				`The especified value (${realValue}) is not a ${
!isClass ? 'CSS selector or a HTMLElement!' : 'valid class'
}\nUsing body tag.`,)
		}
		// returns the body if value is not a HTMLElement or a valid CSS selector
		return qs('body')
	}
	return validateInstance(realValue, HTMLElement) ? realValue : qs(realValue)
}

function errorsHandler(
	{ element, value, min, max, regex, email = false },
	success,
) {
	const elm = validateElementOrClass({value: element, isClass: validateType(element, 'string')})
	console.log(elm)

	// errorsHandler params validations
	if (!validateType(value, 'string'))
		throw new Error(`${getError('string', 'value')}`)
	if (!validateType(min, 'number'))
		throw new Error(`${getError('number', 'min')}`)
	if (!validateType(max, 'number'))
		throw new Error(`${getError('number', 'max')}`)
	if (!validateInstance(regex, RegExp))
		throw new Error(`${getError('invalidRegex', 'regex')}`)
	// ***

	const elmDatasets = (target, dataset) => {
		if (!validateInstance(target, HTMLElement))
			throw new Error(`${getError('element', 'target')}`)

		const validation = validateLength(value, min, max, email, regex)

		if (validation.status === false) {
			target.setAttribute(dataset, validation.error)
			classHandler(target, false)
		} else if (validation.status === true) {
			target.removeAttribute(dataset)
			classHandler(target, true)
		}
	}

	elmDatasets(elm, 'data-error')
}

form.addEventListener('input', e => {
	if (e.target.name === 'name') {
		errorsHandler({
			element: e.target,
			value: e.target.value,
			min: 3,
			max: 25,
			regex: nameRegex,
			email: false,
		})
	} else if (e.target.name === 'email') {
		errorsHandler({
			element: e.target,
			value: e.target.value,
			min: 64,
			max: 254,
			regex: nameRegex,
			email: true,
		})
	}
})

function cardsHandler({ e, cards, className, callback, button }) {
	// if the button is not a HTMLButtonElement and does not have the role === 'button'
	if(!validateInstance(validateElementOrClass({value: button, isClass: validateType(button, 'string')}), HTMLButtonElement)
		&& getAttr(button, 'role', HTMLElement) !== 'button') throw new Error(`${getError('element',
'button',
'HTMLElement with role === \'button\' or an HTMLButtonElement')}`)

	if(e.target !== button) return

	let actualCard = qs(`.${cards}.${className}`)
	if (!actualCard) throw new Error(`${className} not found in ${cards}!`)

	const newCard = actualCard.nextElementSibling
	const cardList = qsa(`.${cards}`)

	// If there are no more sibling elements or the next sibling element is not an HTMLElement...
	if (newCard?.classList.contains(className) || !validateInstance(newCard, HTMLElement)) return

	if (
		actualCard.classList.contains(className) &&
		actualCard !== cardList[cardList.length - 1]
	) {
		actualCard.classList.remove(className)
		newCard.classList.add(className)
		actualCard = newCard
		callback(cardList, actualCard)
	}
	return { cards: cardList, actualCard: actualCard }
}

function addArrow({
	container,
	firstCard,
	className,
	where,
	arrowClass,
	arrowIcon,
	stylesAfter,
	arrowStyles = {}
}) {
	validateElementOrClass(container, validateType(container, 'string'))
	validateElementOrClass(firstCard, validateType(firstCard, 'string'))
	if(!validateType(className, 'string')) throw new Error(`${getError('string', 'className')}`)
	if(!validateType(where, 'string')) throw new Error(`${getError('string', 'where')}`)
	if(!validateType(arrowClass, 'string')) throw new Error(`${getError('string', 'arrowClass')}`)
	if(!validateType(arrowStyles, 'object')) throw new Error(`${getError('object', 'arrowStyles')}`)

	if (firstCard.classList.contains(className)) return
	const realContainer = validateElementOrClass({
		value: container,
		isClass: validateType(container, 'string')},
	)
	const containerList = qs(`.${container}`)
	const addStylesAfter = validateType(stylesAfter, 'number') && stylesAfter !== 0 ? stylesAfter : 0

	if (validateElementOrClass({value: arrowClass, isClass: validateType(arrowClass, 'string'), warn: false}) !== d.body && qs(arrowClass.startsWith('.') ? arrowClass : `.${arrowClass}`)) return

	const arrow = document.createElement('span')
	arrow.classList.add(arrowClass)
	arrow.textContent = arrowIcon

	if(validateType(arrowStyles, 'object') && Object.keys(arrowStyles).length > 0) {
		setTimeout(() => {
			for (const [key, value] of Object.entries(arrowStyles)) {
				arrow.style[key] = value
			}
		}, addStylesAfter);
	}

	qs(`.${container}`).insertAdjacentElement(where, arrow)
}

			addArrow({
				container: 'wrapper__title',
				firstCard: 'wrapper__card',
				className: 'actual',
				where: 'beforeend',
				arrowClass: 'arrow-back',
				arrowIcon: '←',
				stylesAfter: 250,
				arrowStyles: {
					opacity: 1,
					visibility: 'visible'
				}
			})

function stepsHandler(steps, oldStep, newStep) {
	console.log(steps, oldStep, newStep)
}

function buttonHandler({button}){
}

d.addEventListener('click', e => {
	cardsHandler({
		e: e,
		cards: 'wrapper__card',
		className: 'actual',
		newC: 'wrapper__card.wrapper__options',
		button: 'mipinga',
		callback: (cardList, actualCard) => {
			if (actualCard === cardList[0]) return

			//if(qs('.arrow-back'))
			addArrow({
				container: 'wrapper__title',
				firstCard: cardList[0],
				className: 'actual',
				where: 'beforeend',
				arrowClass: 'arrow-back',
				arrowIcon: '←',
				stylesAfter: 250,
				arrowStyles: {
					opacity: 1,
					visibility: 'visible'
				}
			})
		},
	})
})

function optionsHandler(e, option, selectedClass) {}
