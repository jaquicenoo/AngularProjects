// clase principal de antecedente

function Background(code) {
    this.control = null;
    this.controls = new Array();
    this.code = code;
    this._visible = true;
    this._valid;
    // inicialización 
    this.init();
}
// getters and setters 

Background.prototype = {
    get Visible() {
        return this._visible;
    },
    set Visible(value) {
        this._visible = value;
    },
    get Valid() {
        return this._valid;
    },
    set Valid(value) {
        this._valid = value;
    }
}

// inicializador principal 

Background.prototype.init = function() {
    this.control = document.getElementById(this.code);
    // creación de cada control
    this.control.querySelectorAll('[data-control]').forEach(function(control) {
        let data = control.dataset;
        this.controls.push(this.createControlByType(control.id, data.type, data.code, this.code));
    }, this);

};

// setea la visibilidad del control
Background.prototype.changeVisibility = function() {
    if (this.Visible) {
        this.control.parentElement.classList.remove('hidden');
    } else {
        this.control.parentElement.classList.add('hidden');
    }
};

// evalua si el control es valido y uestra un mensaje
Background.prototype.showAlert = function(error) {
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
        if (!alarm || this.type === 'L') {
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

// instancia un control deacuerdo al tipo 
Background.prototype.createControlByType = function(id, type, code, parentCode) {
    switch (type) {
        case 'TB':
            return new BackgroundControlTextBox(id, type, code, parentCode);
        case 'TF':
            return new BackgroundControlTagify(id, type, code, parentCode);
        case 'CG':
            return new BackgroundControlGroupBox(id, type, code, parentCode);
        case 'TA':
            return new BackgroundControlTextArea(id, type, code, parentCode);
        case 'SE':
            return new BackgroundControlSelect(id, type, code, parentCode);
        case 'SW':
            return new BackgroundControlSwitch(id, type, code, parentCode);
        default:
            return new BackgroundControl(id, type, code, parentCode);
    }
};

//override 

Background.prototype.bussinessLogic = function() {};

// en esta funcion cada antecednete hace lo que tenga que hacer en su init
Background.prototype.initBackground = function() {};