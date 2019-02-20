// clase padre para variables de signos vitales

function VitalSignsVar(type,code,min,max,alerts,dependences,unids,patient) {
	this.type = type;
	this.code = code;
	this.control = null;
	this.dependences = dependences;
	this._patient = patient;
	this._isValid = null;
	this._visible = true;
	this.min = min;
	this.max = max;
	this.unids = unids;
	this.alerts = alerts;
	this.watcher = null;
	this._value = null;
}

// getters and setters 

VitalSignsVar.prototype = {
	get Value() {
		return this._value;
	},
	set Value(data) {
		this._value = data;
		this.isValid = true;
		this.showAlert();
		this.showValue();
	},
	set Patient(patient) {
		this._patient = patient;
	},
	get Patient() {
		return this._patient;
	},
	get isValid() {
		return this._isValid;
	},
	set isValid(value) {
		this._isValid = value;
		if (!value) this._value = null;
		// si tiene que avisar que cambio su valor lanza el evento
		if (this.watcher) this.control.dispatchEvent(this.watcher);
		//let parent = this.control.closest('#idVitalSigns');
		//let item = document.getElementById('#' + parent.dataset.bcitemid);
		//if (!value) {
		//	parent.classList.add('bcError');
		//} else {
		//	parent.classList.remove('bcError');
		//}
	},
	get Visible() {
		return this._visible;
	},
	set Visible(value) {
		this._visible = value;
		this.changeVisibility();
	}

};


VitalSignsVar.prototype.init = function () {
	// se obtiene el control
	this.control = document.getElementById(this.code);
	// init de la variable
	this.initControl();
};

// evalua si el control es valido y uestra un mensaje
VitalSignsVar.prototype.showAlert = function (error) {
	// carga el control de la alerta
	let errorMs = this.control.querySelector('.scse-alert');
	if (!this._isValid) {
		// solo si se envia un error
		if (error) {
			errorMs.dataset.message = error;
			errorMs.querySelector('i').className = 'fas fa-times';
			this.control.style.setProperty("--main-alarm-color", '#ea8807');
			this.control.classList.add('show-alert');
			return;
		}
	} else {
		// busca la alarma deacuerdo al rango de valores
		let alarm = this.alerts.find(alarm => this.Value >= alarm.MinValue && this.Value <= alarm.MaxValue);
		if (!alarm || this.type  === 'L') {
			this.control.classList.remove('show-alert');
			return;
		}
		// setea la clase al control y cambia la variable global del color	
		errorMs.dataset.message = alarm.Description;
		errorMs.querySelector('i').className = 'fas fa-exclamation';
		this.control.style.setProperty("--main-alarm-color", `RGB(${alarm.ColorAlert})`);
		this.control.classList.add('show-alert');

	}
};

VitalSignsVar.prototype.calculeLimits = function () {

	// se calucula el limite inferior y se setea el valor

	// se calucula el limite superior y se setea el valor

};

// setea la visibilidad del control
VitalSignsVar.prototype.changeVisibility = function () {
	if (this.Visible) {
		this.control.parentElement.classList.remove('hidden');
	} else {
		this.control.parentElement.classList.add('hidden');
	}
};

// metodos que se sobre escriben por los hijos

// valida el rango de valores permitidos para la variable
VitalSignsVar.prototype.validate = function () { };

// init de la variable
VitalSignsVar.prototype.initControl = function () { };

// manejador del watcher
VitalSignsVar.prototype.handlerWatch = function () { };

VitalSignsVar.prototype.showValue = function () {};