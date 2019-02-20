// clase para variable tipo numerica signos vitales

function VSNumericVar(type, code, min, max, alerts, dependences, patient) {
	// herencia de la clase padre
	VitalSignsVar.call(this, type, code, min, max, alerts, dependences, patient);

	// expesión regular con la que se valida el campo
	this.numberRegex = /^[0-9]*$/m;
}
// herencia del prototipo de la clase padre
VSNumericVar.prototype = Object.create(VitalSignsVar.prototype);
VSNumericVar.prototype.constructor = VSNumericVar;

// metodos sobreescritos 

VSNumericVar.prototype.initControl = function () {
	// listener 
	this.control.addEventListener("blur", this.validate.bind(this), true);
};

// valida segun los datos del paciente y los rangos establecidos 

VSNumericVar.prototype.validate = function () {
	let value = this.control.querySelector('input').value;
	// si no tiene nada no hace nada
	//if (!value.trim()) return;
	/* si no pudo convertir el valor o no coincide con el regex
	 * retorna errorde lo contrario valida el control y setea el valor
	 */
	if (this.numberRegex.test(value.trim())) {
		value = parseInt(value);
		// evalua si el valor esta dentro del rango
		if (value > this.min && value < this.max) {
			this.Value = value;
		} else {
			this.isValid = false;
			this.showAlert(`el valor debe estar entre ${this.min} y ${this.max}`);
		}
	} else {
		this.isValid = false;
		this.showAlert('Campo numérico');
	}
};

VSNumericVar.prototype.showValue = function () {
	// override
	this.control.querySelector('input').value = this.Value;
};
