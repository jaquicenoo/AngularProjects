// clase para variable tipo on off signos vitales

function VSOnOffVar(type, code, min, max, alerts, dependences, patient) {
	// herencia de la clase padre
	VitalSignsVar.call(this, type, code, min, max, alerts, dependences, patient);
}
// herencia del prototipo de la clase padre
VSOnOffVar.prototype = Object.create(VitalSignsVar.prototype);
VSOnOffVar.prototype.constructor = VSOnOffVar;

// metodos sobreescritos 

VSOnOffVar.prototype.showValue = function () {
	// override
};
