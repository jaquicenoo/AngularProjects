function PatientDestinationComponent() {
	this.component = null;
	this.patientDestination = null;
	this.anotherPatientDestination = null;
	this.anotherPatientDestinationContent = null;
	this.episode;
	this.firstSave;
	this.jsonApiBaseUrl;
	this.jsonApiCollection;
	this.lastSaved = '';
    this.saveIntervalMinutes;
    this.bcItemId;
    this.isRequired;
}

PatientDestinationComponent.prototype.init = function () {
	// se selecciona el componente
	this.component = document.getElementById('patientDestinationComponent');
	this.patientDestination = this.component.querySelector('select[name="patientDestination"]');
	this.anotherPatientDestination = this.component.querySelector('input[name="anotherPatientDestination"]');
	this.anotherPatientDestinationContent = this.component.querySelector('#anotherPatientDestinationContent');
	// se inicializan los parametros de la clase
	this.episode = this.component.dataset.episode;
	this.jsonApiBaseUrl = this.component.dataset.apiBaseUrl;
	this.jsonApiCollection = this.component.dataset.apiCollectionName;
	this.saveIntervalMinutes = this.component.dataset.saveIntervalMinutes;
	this.firstSave = this.component.dataset.firstSave;
	//this.patientDestination.change(this.ChangePatientDestination);
	this.patientDestination.addEventListener("change", this.ChangePatientDestination.bind(this));
    this.anotherPatientDestination.addEventListener("blur", this.inputBlur.bind(this));
    this.bcItemId = this.component.dataset.bcitemid;
    this.isRequired = this.component.dataset.required != undefined ? this.component.dataset.required.toLowerCase() === 'true' ? true : false : false;
	this.startPartialSaveInterval();
};

PatientDestinationComponent.prototype.ChangePatientDestination = function (evt) {
	var option = evt.target.querySelector("option:checked");

    if (option.value !== 'Seleccione...') {
        $(this.patientDestination).tooltip('dispose');
    }

	if (option.value === "OT") {
		this.anotherPatientDestinationContent.classList.remove('hide-me');
	} else {
        this.anotherPatientDestinationContent.classList.add('hide-me');
        $(this.anotherPatientDestination).tooltip('dispose');
		//this.anotherPatientDestination.value ='';
	}
};

PatientDestinationComponent.prototype.inputBlur = function (e) {
    if (!this.isRequired)
        return true;

    if ($(e.target).val().length === 0) {
        $(e.target).addClass('IsWrong');
        $("#" + this.bcItemId).addClass('bcError');
        ShowMyError($(e.target), 'Campo obligatorio');
    }
    else {
        $(e.target).removeClass('IsWrong');
        $(e.target).tooltip('dispose');
        var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
        if (container) {
            var errors = $(container).find('.IsWrong');
            if (errors.length === 0)
                $("#" + this.bcItemId).removeClass('bcError');
        }
    }
};

// aquí se valida el componente
PatientDestinationComponent.prototype.validate = function () {
    if (!this.isRequired)
        return true;

    var result = true;
    if (this.patientDestination.value === 'Seleccione...') {
        result = false;
        ShowMyError(this.patientDestination, 'Seleccione una opción');
    }
    if (this.patientDestination.value === 'OT' && this.anotherPatientDestination.value === '') {
        result = false;
        ShowMyError(this.anotherPatientDestination, "Campo obligatorio");
    }

    if (result) {
        var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
        if (container) {
            var errors = $(container).find('.IsWrong');
            if (errors.length === 0)
                $("#" + this.bcItemId).removeClass('bcError');
        }
    }
    else
        $("#" + this.bcItemId).addClass('bcError');

    return result;
};

PatientDestinationComponent.prototype.startPartialSaveInterval = function () {
	let thisObj = this;
	setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 10000);
};

PatientDestinationComponent.prototype.ComponentPartialSave = async function () {
	var jsonData = {
		SelectedDestinationValue: this.patientDestination.value,
        AnotherDestination: this.anotherPatientDestination.value,
        DestinationText: $(this.patientDestination).find('option:selected').text()
	};

	var jsonObj = createPartialSaveObject(this.episode, this.jsonApiCollection, jsonData);
	if (jsonObj === null) {
		console.log('PatientDestinationComponent error: json bad format');
		return;
	}
	if (JSON.stringify(jsonObj) !== this.lastSaved) {
		var method = 'POST';
		var url = this.jsonApiBaseUrl;
		if (this.firstSave === "false") {
			method = 'PUT';
			url = this.jsonApiBaseUrl + this.episode + "/" + this.jsonApiCollection;
		}

		var result = await SendPartialSavedData2(jsonObj, method, 'text');
		if (result) {
			this.component.dataset.lastSaved = jsonObj;
			this.component.dataset.firstSave = "false";
			this.firstSave = "false";
		}

		return result;
	}
};