const d = document

const qs = s => !d.querySelector(`${s}`) ? new Error(`Element with selector ${s} not found!`) : d.querySelector(`${s}`)
const qsa = s => !d.querySelectorAll(`${s}`) ? new Error(`Element with selector ${s} not found!`) : d.querySelectorAll(`${s}`)

export default function form({container = {}}){
	const opts = Array.from(container.form).filter(el => el.classList.contains('wrapper__option'))
	d.addEventListener('click', e => {

		updateOptions({options: opts, selected: 'selected', event: e})

		function updateSteps(steps){
			let actualStep = steps.filter(step => step.classList.contains('actual'))[0]

			if(actualStep?.classList.contains('actual')){
				actualStep.classList.remove('actual')
				actualStep.classList.add('passed')
			}

			if(actualStep?.nextElementSibling){
				actualStep.nextElementSibling.classList.add('actual')
				actualStep = actualStep.nextElementSibling
			}

		}

		function updateBtn(button,text, attr, attrValue){ 
			button.textContent = text

			if(attr){
				button.setAttribute(attr, attrValue ? attrValue : '')
			}
		}

		function updateForm(card,form){

			updateSteps(Array.from(container.steps))

			if(form?.nextElementSibling){
				card.dataset.step = form.nextElementSibling.dataset.step
				form.classList.add('hidden')
				form.nextElementSibling.classList.remove('hidden')
				container.title.textContent = form.nextElementSibling.dataset.title
			}else{
				updateBtn(container.button, '', 'disabled')
			}

			if(card.dataset.step === '3'){
				updateSummary({summary: container.summary, name: container.form.name.value, email: container.form.email.value, list: container.list})
				updateBtn(container.button, 'Confirm')
			}
		}

		if(e.target === container.button && !container.form.classList.contains('error')){
			updateForm(container.form, Array.from(container.form.children).filter(el => !el.classList.contains('hidden') && el.nodeName !== 'H1')[0])
		}
	})

	function validateInput(input, regex){
		if(!regex.test(input.value)){
			container.form.classList.add('error')
			input.classList.add('invalid')
		}else{
			container.form.classList.remove('error')
			input.classList.remove('invalid')
		}
		return regex.test(input.value)
	}

	d.addEventListener('input', e => { validateInput(e.target, container[`${e.target.name}Regex`]) })
}

function updateSummary({summary, name, email}) {
	const opts = d.querySelectorAll('.wrapper__option.selected')

	summary.innerHTML = `
	<div class='summary__user-info'>
		<p><span>Name:</span> ${name}</p>\n
		<p><span>Email:</span> ${email}</p>\n
	</div>
	`

	const list = d.createElement('ul')
	list.innerHTML = '<span>Topics:</span>'

	if(opts.length === 0){
		const li = d.createElement('li')
		li.innerHTML = `<span class='no-topics'>No interested topics</span>`
		list.append(li)
	}

	for (const opt of opts) {
		const li = d.createElement('li')
		li.textContent = opt.value
		list.append(li)
	}
	summary.append(list)
}

function updateOptions({options, selected,event}){
	const selectedOpts = Array.from(options).filter(opt => opt.classList.contains(selected))

		for (const opt of Array.from(options)) {
			if(event.target === opt){
				opt.classList.toggle(selected)
			}
		}
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
