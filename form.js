const d = document

const qs = s => !d.querySelector(`${s}`) ? new Error(`Element with selector ${s} not found!`) : d.querySelector(`${s}`)
const qsa = s => !d.querySelectorAll(`${s}`) ? new Error(`Element with selector ${s} not found!`) : d.querySelectorAll(`${s}`)

export default function form({container = {}, buttons = {} }){
	if(Object.keys(container).length === 0) console.error('container object can\'t be empty')
	if(Object.keys(buttons).length === 0) console.error('buttons object can\'t be empty')
	console.log(container, buttons)
}

function updateSummary({name, email, list, selectedOptions}) {
	options = Array.from(selectedOptions)

	for (const option of options) {
		console.log(options)
	}
}

function updateOptions({options, selected, output}){
	const opts = Array.from(qsa(verifyDot(options)))
	const selectedOpts = opts.filter(opt => opt.classList.contains(selected))

	d.addEventListener('click', e => {
		for (const opt of opts) {
			if(e.target === opt && opt.classList.contains(selected)){
				opt.classList.remove(selected)

				// if option already exist in the array, remove it
				if(selectedOpts.includes(opt)) selectedOpts.splice(selectedOpts.indexOf(opt),1);

			}else if(e.target === opt && !opt.classList.contains(selected)){
				opt.classList.add(selected)
				selectedOpts.push(opt)
			}
		}
	})

	output.opts = opts
	output.selectedOpts = opts
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
	if (value.startsWith('.')) return value
	return `.${value}`
}
