
let i1, i2, i3, i4, i5;
let skipinput, goodinput;

// This is used for smart handling of the backspace key
let emptytext = true;

window.onload =  () => {
	i1 = document.getElementById('l1');
	i2 = document.getElementById('l2');
	i3 = document.getElementById('l3');
	i4 = document.getElementById('l4');
	i5 = document.getElementById('l5');
	skipinput = document.getElementById('skips');
	goodinput = document.getElementById('goods');

	i1.addEventListener('keyup', upper, false);
	i2.addEventListener('keyup', upper, false);
	i3.addEventListener('keyup', upper, false);
	i4.addEventListener('keyup', upper, false);
	i5.addEventListener('keyup', upper, false);

	// Used for smart handling of the backspace key
	i2.addEventListener('focus', checkempty, false);
	i3.addEventListener('focus', checkempty, false);
	i4.addEventListener('focus', checkempty, false);
	i5.addEventListener('focus', checkempty, false);

    
	// Used for smart handling of the backspace key
	i1.addEventListener('focusout', colorize, false);
	i2.addEventListener('focusout', colorize, false);
	i3.addEventListener('focusout', colorize, false);
	i4.addEventListener('focusout', colorize, false);
	i5.addEventListener('focusout', colorize, false);

	//skipinput.addEventListener('focusout', upper);

	i1.select();
}

function colorize(event) {
	if (this.value === '') {
		this.style.backgroundColor = 'white';
	}
	else {
		this.style.backgroundColor = 'rgb(121,168,107)';
	}
}

function checkempty(event) {
	// Check if a textbox is empty or not when it gains focus
	emptytext = (this.value === '') ? true : false;
    this.select();
}

function upper(event) {
	switch(event.keyCode) {
		case 37:
			// On <left key> select the previous element
			if (this.previousElementSibling) {
				this.previousElementSibling.focus();
			}
			break;
		case 39:
			// On <right key> select the next element
			if (this.nextElementSibling) {
				this.nextElementSibling.focus();
			}
			break;
		case 8:
			// On <backspace> If the text box is empty - select the previous one,
			// if not - just delete the text in it
			if (emptytext && this.previousElementSibling) {
				this.previousElementSibling.focus();				
			} else {
				emptytext = true;
			}
			break;
		default:
			if ((/[a-zA-ZäöüÄÖÜÑñ]/).test(this.value)) {
				//this.value = this.value.toUpperCase();
                this.style.backgroundColor = 'rgb(121,168,107)';

				this.select();
				if (this.nextElementSibling) {
					this.nextElementSibling.focus();
				}
			} else {
				this.value = '';
				this.select();
			}
		break;
	}
}

function getResults() {
	const l1 = i1.value||'.';
	const l2 = i2.value||'.';
	const l3 = i3.value||'.';
	const l4 = i4.value||'.';
	const l5 = i5.value||'.';
	const regex = l1 + l2 + l3 + l4 + l5;
	const rTable = document.getElementById('rtable');
	const rHits = document.getElementById('hits');
	const lSelect = document.getElementById('language');
	let lval = lSelect.options[lSelect.selectedIndex].value;
	//let array = (lval === 'en') ? array_en : array_de;
	let hit = 0;
	rTable.innerHTML = '';
	rHits.innerHTML = '';
	let rString = '';
	let array;
	let filtered = [];
	let filtered2 = [];
		
	// Choose selected language
	switch (lval) {
		case 'en': 
			array = array_en;
			console.log('Selected englisch');
			break;
		case 'de':
			array = array_de;
			console.log('Selected german');
			break;
		case 'es':
			array = array_es;
			console.log('Selected spanish');
			break;
		default:
			console.log('Unknown language: ' + lval);
			array = array_en;
			break;
	}

	// Pre-Filter words by letters with known position
	array.forEach((i) => {
		if(match = i.match(regex.toUpperCase())) {
			filtered.push(i);
		};
	});

	// Filter words by excluded characters
	let filterstring = skipinput.value.toUpperCase();
    if (filterstring !== '') {
		console.log('Filtering excluded characters: ' + filterstring)
		filtered.forEach((j) => {
			let go = true;
			for (const f of filterstring) {
				if (j.indexOf(f) >= 0) {
					go = false;
				}
			}

			if (go) {
				filtered2.push(j);
			}
		});
	} else {
		console.log('Skipping skips');
		filtered2 = filtered;
	}

	// Filter words by included characters
	let filterstring2 = goodinput.value.toUpperCase();
	if (filterstring2 !== '') {
		console.log ('Filtering included characters:' + filterstring2);
		filtered2.forEach((k) => {
			let goodvalid = false;
			for (const g of filterstring2) {
				if (k.indexOf(g) >= 0) {
					goodvalid = true;
				} else {
					goodvalid = false;
					break;
				}
			}

			if (goodvalid) {
				addResultRow(k, rTable);
				hit++;
			}
		});
	} else {
		console.log ('No included characters - skipping filter');
		filtered2.forEach((k) => {
			addResultRow(k, rTable);
			hit++;
		})
	}
	
	if (hit) {
		rHits.innerHTML = hit + ' results:';
	} else	{
		addResultRow('No Results!', rTable);
		rHits.innerHTML = '';
	}
}

function addResultRow(txt, rTable) {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.appendChild(document.createTextNode(txt));
	tr.appendChild(td);
	rTable.appendChild(tr);
}