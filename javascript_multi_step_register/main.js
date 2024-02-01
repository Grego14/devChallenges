import validateForm from './validateForm.js'

const d = document
const qs = s => d.querySelector(`${s}`)
const qsa = s => d.querySelectorAll(`${s}`)

const emailRegex =
	/^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/
const nameRegex = /^[a-zA-Z\s.'-]{3,}$/

validateForm({
	form: '.wrapper__form',
	inputs: {
		name: {
			min: 3,
			max: 25,
			regex: nameRegex,
		},
		email: {
			min: 64,
			max: 254,
			regex: emailRegex
		}
	},
	options: 'wrapper__option',
	button: '.wrapper__button',
	summary: {
		name: 'summary__name',
		email: 'summary__email',
		optionsList: 'summary__list'
	}
})

//const inputs = qsa('.wrapper__input')
//const steps = qsa('.wrapper__step')
//const options = qsa('.wrapper__option')
//const cards = qsa('.wrapper__card')
