
// clase principal de signos vitales 

function VitalSigns(patient) {
	this.control = null;
	this.variables = new Array();
	this.patient = patient;
	this.episode;
	this.firstSave;
	this.jsonApiBaseUrl;
	this.jsonApiCollection;
	this.lastSaved = '';
	this.saveIntervalMinutes;
	this.apiBaseGrowtPattern;
}

// inicializacion de variables

VitalSigns.prototype.init = function () {
	// se selecciona el componente

	this.control = document.getElementById('idVitalSigns');
	this.episode = this.control.dataset.episode;
	this.jsonApiBaseUrl = this.control.dataset.apiBaseUrl;
	this.jsonApiCollection = this.control.dataset.apiCollectionName;
	this.saveIntervalMinutes = this.control.dataset.saveIntervalMinutes;
	this.firstSave = this.control.dataset.firstSave;
	this.lastSaved = this.control.dataset.lastSaved;
	this.apiBaseGrowtPattern = this.control.dataset.apiBaseGrowtPattern;;

	// se crea cada vatiable 

	this.control.querySelectorAll('[data-variable]').forEach(function (vsvar) {

		// instancia la variable segun el tipo
		let data = vsvar.dataset;
		this.variables.push(this.createVarByType(data,vsvar.id));

		// se agrega el listener para cerrar el mensage de alerta
		//variable.querySelector('.error').addlistener('click', control.removeMessage);
		
	}, this);

	// evento que setea las variables del modal de variables adicionales

	$(".bd-example-modal-lg").on('shown.bs.modal', this.setCloneVars.bind(this));

	/*evento del hidden del modal aca se cambia el target al objeto de las variables*/

	$('.bd-example-modal-lg').on('hidden.bs.modal', this.modalHidden.bind(this));

	this.initLastSavedValues();
	this.startPartialSaveInterval();
};

VitalSigns.prototype.initLastSavedValues = function () {
	if (this.lastSaved.length > 0) {
		var jsonLastSaved = JSON.parse(this.lastSaved);
		jsonLastSaved.Variables.forEach(function (variable) {
            var varControl = this.variables.filter(v => v.code === variable.Code);
			if (varControl !== null && varControl.length > 0 && variable.Value !== null) {
				varControl[0].Value = variable.Value;
			}
		}, this);
	}
};

// aca se valida el componente
VitalSigns.prototype.validate = function () {
	let validate = true;
	let control = document.getElementById('idVitalSigns');
	this.variables.forEach(function (myvar) {
		if (!myvar.isValid || myvar.isValid === null) {
			validate = false;
			$('#' + control.dataset.bcitemid).addClass('bcError');
			return;
		}
	});
	$('#' + control.dataset.bcitemid).removeClass('bcError');
	return validate;
};

// retorna null si la variable no existe, de lo contrario su valor
VitalSigns.prototype.getVariable = function (varCode) {
	var resArray = this.variables.filter(v => v.code === varCode);
	return resArray.length > 0 ? resArray[0] : null;
};

// retornal true si la variable es valida
VitalSigns.prototype.getVariableStatus = function (varCode) {
	let vsvar = this.variables.find(v => v.code === varCode);
	if (vsvar) return vsvar.isValid;
	else return false;
};

// agrega un observable del valor de estado de la variable
VitalSigns.prototype.addWatcher = function (WatchCode,handlerWatch) {
	let vsvar = this.variables.find(v => v.code === WatchCode);
	if (vsvar) {
		vsvar.watcher = new CustomEvent('watch', { 'isValid': vsvar.isValid });
		vsvar.control.addEventListener('watch', handlerWatch , false);
	}
};


VitalSigns.prototype.startPartialSaveInterval = function () {
	let thisObj = this;
	setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 10000);
};

VitalSigns.prototype.ComponentPartialSave = async function () {
	var jsonData = this.getUserValidData();

	var jsonObj = createPartialSaveObject(this.episode, this.jsonApiCollection, jsonData);
	if (jsonObj === null) {
		console.log('VitalSigns.js error: json bad format');
		return;
	}
	if (JSON.stringify(jsonData) !== this.lastSaved) {
		var method = 'POST';
		//var url = this.jsonApiBaseUrl;
		if (this.firstSave === "false") {
			method = 'PUT';
			//url = this.jsonApiBaseUrl + this.episode + "/" + this.jsonApiCollection;
		}
		var result = await SendPartialSavedData2(jsonObj, method, 'text');
		if (result) {
			this.lastSaved = JSON.stringify(jsonData);
			this.firstSave = "false";
			this.control.dataset.lastSaved = this.lastSaved
			this.control.dataset.firstSave = this.firstSave;
			
		}

		return result;
	}
};

VitalSigns.prototype.getUserValidData = function () {
	let jsonValidData = {
		Variables: []
	};
   // var validVars = this.variables.filter(vc => vc.isValid);
	var validVars = this.variables.filter(vc => vc.isValid === true);
	validVars.forEach(function (oneVar) {
		jsonVar = {
			Code: oneVar.code,
			Value: oneVar.Value
		};
		jsonValidData.Variables.push(jsonVar);
	});
	return jsonValidData;
};

VitalSigns.prototype.setCloneVars = function (e) {
	// se actuliza el dato de columnas y filas 
	let cols = e.currentTarget.querySelector('.monitoring-body .table-container').dataset.cols;
	let container = e.currentTarget.querySelector('.add-conteiner');
	container.style.setProperty("--var-cols", cols);
	//cambia de target a las variables que se encuentran en el modal
	e.currentTarget.querySelectorAll('[data-clonevar]').forEach(function (clonevar) {
		let vsvar = this.variables.find(v => v.code === clonevar.dataset.codevar);
		if (vsvar) {	
			vsvar.code = clonevar.id;
			vsvar.init();
			if (vsvar.type === "L") clonevar.querySelector('select').value = vsvar.Value;
			else clonevar.querySelector('input').value = vsvar.Value;
			clonevar.dataset.initVal = vsvar.Value;
			vsvar.showAlert();
		}
	}, this);
	// seteo de variables adicionales
	e.currentTarget.querySelectorAll('[data-variable]').forEach(function (vsvar) {

		// instancia la variable segun el tipo
		let varDupe = this.variables.find(v => v.code === vsvar.id);
		if (!varDupe) {
			let data = vsvar.dataset;
			this.variables.push(this.createVarByType(data, vsvar.id));
		}

	}, this);

	// enlaza los eventos del los botones
	e.currentTarget.querySelectorAll('.scse-btn').forEach(function (btn) {
		btn.addEventListener('click', this.modalBtnClick.bind(this));
	}, this);
	// evento del scroll 
	e.currentTarget.querySelectorAll('.table-container').forEach(function (elt) {
		elt.addEventListener('scroll', this.onTableScroll);
	}, this);
};

VitalSigns.prototype.modalHidden = function (e) {
	// cambia el target de las variables del modal a las varibales principales
    initLoadingModal('body', 'cargando signos vitales');
    e.currentTarget.querySelectorAll('[data-clonevar]').forEach(function (clonevar) {
		let vsvar = this.variables.find(v => v.code === clonevar.id);
		if (vsvar) {
			vsvar.code = clonevar.dataset.codevar;
			vsvar.init();
			let newval = clonevar.dataset.initVal;
			if (newval && vsvar.isValid === true) vsvar.Value = newval;
		}
    }, this);
    destroyLoadingModal('body');

};

VitalSigns.prototype.modalBtnClick = function (e) {

	let modal = e.currentTarget.closest('.bd-example-modal-lg');
	// cambia el target de las variables del modal a las varibales principales
	// verifica si el boton de check fue seleccionado
	if (e.currentTarget.classList.contains('check')) {
		modal.querySelectorAll('[data-clonevar]').forEach(function (clonevar) {
			let vsvar = this.variables.find(v => v.code === clonevar.id);
			if (vsvar) {
				if (vsvar.type === "L") clonevar.dataset.initVal = clonevar.querySelector('select').value;
				else clonevar.dataset.initVal= clonevar.querySelector('input').value;
			}
		}, this);
	}
	if (e.currentTarget.classList.contains('cancel')) {
		modal.querySelectorAll('[data-variable]').forEach(function (vsvar) {
			
		}, this);
	}
	// cierra el modal
	$(modal).modal('hide');
};

VitalSigns.prototype.onTableScroll = function (e) {
	let modal = e.currentTarget.closest('.bd-example-modal-lg');
	modal.querySelectorAll('.table-container').forEach(function (elt) {
		elt.scrollLeft = e.currentTarget.scrollLeft;
	});
};

// se crea el objeto dependiendo del tipo de variable
VitalSigns.prototype.createVarByType = function (data,targetId) {
	let varControl;
	switch (data.type) {

		case 'N':
			varControl = new VSNumericVar(data.type, targetId, data.min, data.max, JSON.parse(data.alerts),
				data.dependences, data.units, this.patient);
			break;
		case 'F':
			varControl = new VSCalculateFieldVar(data.type, targetId, data.min, data.max, JSON.parse(data.alerts),
				data.dependences, data.units, this.patient, data.formule, this.getVariable.bind(this), this.apiBaseGrowtPattern);
			break;
		case 'L':
			varControl = new VSListVar(data.type, targetId, data.min, data.max, JSON.parse(data.alerts),
				JSON.parse(data.dependences), data.units, this.patient);
			break;
		case 'B':
			varControl = new VSOnOffVar(data.type, targetId, data.min, data.max, JSON.parse(data.alerts),
				data.dependences, data.units, this.patient);
			break;

		default:
	}
	/*estos metodos se llaman desde el control para poder acceder
	* a información de otras variables
	*/
	varControl.addWatcher = this.addWatcher.bind(this);
	varControl.getVariableStatus = this.getVariableStatus.bind(this);
	varControl.init();
	return varControl;
};