import validateForm from './validateForm.js'

const d = document
const qs = s => d.querySelector(`${s}`)
const qsa = s => d.querySelectorAll(`${s}`)

const emailRegex =
	/^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/
const nameRegex = /^[a-zA-Z\s.'-]{3,}$/

validateForm({
	container: {
		form: qs('.wrapper__forms'),
		card: qsa('.wrapper__card'),
		steps: qsa('.wrapper__step'),
		title: qs('.wrapper__title'),
		list: qs('.summary-list'),
		button: qs('.wrapper__button'),
		summary: qs('.wrapper__form-summary'),
		emailRegex: emailRegex,
		nameRegex: nameRegex,
		inputs: qsa('.wrapper__input')
	}
})
