// clase para variable tipo lista signos vitales

function VSListVar(type, code, min, max, alerts, dependences, unids, patient) {
	// herencia de la clase padre
	VitalSignsVar.call(this, type, code, min, max, alerts, dependences, unids, patient);
}
// herencia del prototipo de la clase padre
VSListVar.prototype = Object.create(VitalSignsVar.prototype);
VSListVar.prototype.constructor = VSListVar;

// cargue inicial 
VSListVar.prototype.initControl = function () {

	// se agrega un listener a las variables de las que depende
	if (this.dependences.length !== 0 && (!this.control.classList.contains('grid-item')
		&& !this.control.parentElement.classList.contains('grid-item'))) this.Visible = false;
	this.dependences.forEach(function (depend) {
		this.addWatcher(depend, this.handlerWatch.bind(this));
	}, this);

	// listener para el cambio de valor
	this.control.querySelector('select').onchange = this.validate.bind(this); 
};

// cambio de valor y validaciones
VSListVar.prototype.validate = function (e) {
	this.Value = this.control.querySelector('select').value;
};

// aca se controlan los listener de las variables dependientes
VSListVar.prototype.handlerWatch = function (e) {
	let visible = true;
	this.dependences.forEach(function (depend) {
		// verifica el estado de la variable dependiente
		if (!this.getVariableStatus(depend)) {
			visible = false;
			return false;
		}
	}, this);
	this.Visible = visible;
};

VSListVar.prototype.showValue = function () {
	// override
	if (this.Value!== 'value1' && this.Value !== null) {
		this.control.querySelector('select').classList.remove('select');
	} else {
		this.control.querySelector('select').classList.add('select');
	}
	this.control.querySelector('select').value = this.Value;
};