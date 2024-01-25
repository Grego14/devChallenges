const d = document

const qs = s => d.querySelector(`${s}`)
const qsa = s => d.querySelectorAll(`${s}`)

const wrapper = qs('.wrapper')
const title = qs('.wrapper__title')
const button = qs('.wrapper__button')
const form = qs('.wrapper__form')
const options = qs('.wrapper__options')
const summary = qs('.wrapper__summary')
const steps = qsa('.wrapper__step')
const inputs = qsa('.wrapper__input')
let actualStep = qs('.wrapper__step[checked]')
let actualCardStep = qs('[data-step]').dataset.step

const emailRegex =
	/^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/
const nameRegex = /^([a-zA-Z]){3,}\s?\.?([a-zA-Z]{1,})?([a-zA-Z'-]{2,})?$/u

function stepsHandler(e) {
	if (e.target === actualStep) return

	function updateSteps(t1, t2) {
		t1.classList.remove('checked')
		t1.classList.add('passed')
		if (t2 !== null) {
			t2.classList.add('checked')
			actualStep = t2
		}
	}

	if (e.target === button) {
		if (actualCardStep === '1') {
			nextStep('2', 'Which topics are you interested in?')
			updateSteps(steps[0], steps[1])
		} else if (actualCardStep === '2') {
			nextStep('3', 'Summary')
			updateSteps(steps[1], steps[2])
			showSummary()
		} else if (actualCardStep === '3') {
			nextStep('4', 'Congratulations!')
			updateSteps(steps[2], null)

			qs('.wrapper__content').removeChild(qs('.wrapper__cards'))
			qs('.wrapper__content').removeChild(button)
			qs('.wrapper').removeChild(qs('.wrapper__steps'))

			title.classList.add('title--congratulations')
			qsa('.shine-left').classList.add('shine--congratulations')
			qsa('.shine-right').classList.add('shine--congratulations')
		}
	}
	qs('[data-step]').dataset.step = actualCardStep
}

function nextStep(aCS, text) {
	// update title and actualCardStep number
	actualCardStep = aCS
	title.textContent = text
}

let name = ''
let email = ''

function showSummary(e) {
	const selectedOptions = qsa('.wrapper__option.selected')
	const selectedValues = Array.from(selectedOptions).map(option => option.value)
	const ul = qs('.summary__list')

	qs('.summary__name').innerHTML =
		`<span class='text--semibold font--gray'>Name: </span>${name}`
	qs('.summary__email').innerHTML =
		`<span class='text--semibold font--gray'>Email: </span>${email}`

	button.textContent = 'Confirm'

	const topicsText = ''
	ul.insertAdjacentHTML('beforebegin', topicsText)

	for (const value of selectedValues) {
		const li = d.createElement('li')
		li.classList.add('text--semibold', 'summary__list__item')
		li.textContent = value
		ul.append(li)
	}
}

function updateSelectedOption(e) {
	if (e.target.classList.contains('wrapper__option')) {
		e.target.classList.toggle('selected')
	}
}

function verifyInput({ input, min, max, regex, inputName, falseRegex }) {
	let output = ''

	// returns input.value removing white spaces
	function characters(string) {
		return string.replace(/\s/g, '').length
	}

	if (characters(input.value) > max) {
		input.parentElement.dataset.error = `Error: ${inputName} must be less than ${max} characters`
		output = 'Error'
	} else if (characters(input.value) < min) {
		input.parentElement.dataset.error = `Error: ${inputName} must be more than ${min}
	characters`
		output = 'Error'
	} else if (!regex.test(input.value)) {
		input.parentElement.dataset.error = `Error: ${inputName} ${falseRegex}`
		output = 'Error'
	} else if (input.value.endsWith('.')) {
		input.parentElement.dataset.error = `Error: ${inputName} must end with a letter`
		output = 'Error'
	} else {
		output = 'noError'
	}
	return { error: output, input: input, regex: regex }
}

let inputClass = ''
function inputClassHandler(result) {
	// remove actual class before adding new one

	if (inputClass !== '') result.input.classList.remove(inputClass)
	inputClass = result.error === 'noError' ? 'valid' : 'invalid'

	result.input.classList.add(inputClass)

	if (result.error === 'Error') {
		result.input.parentElement.classList.add('input--error')
	} else {
		result.input.parentElement.classList.remove('input--error')
	}
	if (result.name === 'name') name = result.input.value
	if (result.name === 'email') email = result.input.value
}
form.addEventListener('input', e => {
	if (e.target.name === 'name') {
		const result = verifyInput({
			input: e.target,
			min: 3,
			max: 20,
			regex: nameRegex,
			inputName: 'name',
			falseRegex: 'only accepts letters - or .',
		})
		inputClassHandler(result)
	}
	if (e.target.name === 'email') {
		const result = verifyInput({
			input: e.target,
			min: 6,
			max: 254,
			regex: emailRegex,
			inputName: 'email',
			falseRegex: 'only accepts letters - or . and ONE @',
		})
		inputClassHandler(result)
	}
})

d.addEventListener('click', e => {
	for (const option of options.children) {
		if (e.target === option) {
			updateSelectedOption(e)
		}
	}

	stepsHandler(e)
})
