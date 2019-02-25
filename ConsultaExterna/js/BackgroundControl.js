// clase generica para los controles 

function BackgroundControl(id, type, code, idParent) {
    this.id = id;
    this.code = code;
    this.idParent = idParent;
    this.type = type;
    this.parentControl = null;
    this.control = null;
    this._valid = true;
    this._value = null;
    this._visible = true;
}

// get and set para controles
BackgroundControl.prototype = {
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
        this.showAlert();
    },
    get Value() {
        this.getValue()
        return this._value;
    },
    set Value(value) {
        this._value = value;
        this.setValue(value);
    }
};
// control init 
BackgroundControl.prototype.init = function() {};

// obtiene el valor segun el tipo de control
BackgroundControl.prototype.getValue = function() {};
// setea el valor segun el tipo de control
BackgroundControl.prototype.setValue = function(value) {};
// validacion por tipo 
BackgroundControl.prototype.validate = function() {};

// setea la visibilidad del control
BackgroundControl.prototype.changeVisibility = function() {
    if (this.Visible) {
        this.control.parentElement.classList.remove('hidden');
    } else {
        this.control.parentElement.classList.add('hidden');
    }
};

BackgroundControl.prototype.showAlert = function() {
    var alert = this.parentControl.querySelector('.scse-alert');
    if (!this.Valid) {
        alert.dataset.message = this.control.validationMessage;
        this.parentControl.classList.add('show-alert');
    } else {
        this.parentControl.classList.remove('show-alert');
    }

};

// BackgroundControl.prototype.getErrorMessage = function() {
//     // se obtienen los errores del objeto de validacion del control
//     var message = null;
//     if (this.control.validity.valueMissing) {
//         message = "campo requerido";
//     } else if (this.control.validity.rangeUnderflow) {
//         message = `el valor debe ser mayor a ${this.control.min}`;
//     } else if (this.control.validity.rangeOverflow || this.control.validity.tooLong) {
//         message = `el valor debe ser menor a ${this.control.max}`;
//     } else if (this.control.validity.stepMismatch || this.control.validity.patternMismatch) {
//         message = "el valor no coincide";
//     }
//     return message;
// };





/**********************clase para el groupBox*****************************/

function BackgroundControlGroupBox(id, type, code, idParent) {
    BackgroundControl.call(this, id, type, code, idParent);
    // inicialización 
    this.init();
}
// herencia del prototipo de la clase padre
BackgroundControlGroupBox.prototype = Object.create(BackgroundControl.prototype);
BackgroundControlGroupBox.prototype.constructor = BackgroundControlGroupBox;
//inicilizacion
BackgroundControlGroupBox.prototype.init = function() {
    this.parentControl = document.getElementById(this.idParent).querySelector('#' + this.id);
};
// obtiene el valor desde el dom 
BackgroundControlGroupBox.prototype.getValue = function() {
    var select = this.parentControl.querySelector('input [type="radio"]:checked');
    this._value = select ? select.value : null;;
};
// obtiene el valor desde el dom 
BackgroundControlGroupBox.prototype.setValue = function(value) {
    var select = this.parentControl.querySelector(`input [name="${value}"]`);
    if (select) select.checked = true;
};
// validacion del valor del campo 
BackgroundControlGroupBox.prototype.validate = function() {
    var alert = this.parentControl.querySelector('.animated-label');
};

/**********************clase para el tagify*****************************/

function BackgroundControlTagify(id, type, code, idParent) {
    BackgroundControl.call(this, id, type, code, idParent);
    // inicialización 
    this.init();
}
// herencia del prototipo de la clase padre
BackgroundControlTagify.prototype = Object.create(BackgroundControl.prototype);
BackgroundControlTagify.prototype.constructor = BackgroundControlTagify;
//inicilizacion
BackgroundControlTagify.prototype.init = function() {
    this.parentControl = document.getElementById(this.idParent).querySelector('#' + this.id);
    //crea el objeto del tagify 
    this.control = new Tagify(this.parentControl.querySelector('input'), {
        whitelist: [],
        dropdown: {
            enabled: 1
        }
    });
    this.tfcontroller = null;
    this.tfTransformDataToWhiteList = null;
    if (this.parentControl.hasAttribute("data-tagify-api")) {
        // listen to any keystrokes which modify tagify's input
        this.control.on('input', this.onTagifyInput.bind(this));
    }
};
// obtiene el valor desde el objeto tagify
BackgroundControlTagify.prototype.getValue = function() {
    this._value = this.control.value;
};
// obtiene el valor desde el objeto tagify 
BackgroundControlTagify.prototype.setValue = function(value) {
    this.control.removeAllTags();
    if (!value) return;
    value.forEach(tag => {
        this.control.addTags(tag.value);
    }, this);
};
// validacion del valor del campo 
BackgroundControlTagify.prototype.validate = function() {};

// metodo de busqueda de tagify
BackgroundControlTagify.prototype.onTagifyInput = function(evt) {
    var evtValue = evt.detail;
    var thisObj = this;
    if (evtValue.length >= this.tagify.settings.dropdown.enabled) {

        thisObj.tagify.settings.whitelist.length = 0; // reseteamos la whitelist

        // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
        thisObj.tfcontroller && thisObj.tfcontroller.abort();
        thisObj.tfcontroller = new AbortController();
        var query = thisObj.control.dataset.tagifyApi.replace("[[VALUE]]", evtValue);
        fetch(query, { signal: thisObj.tfcontroller.signal })
            .then(RES => RES.json())
            .then(function(result) {
                var whitelistData = null;
                if (thisObj.tfTransformDataToWhiteList !== null) {
                    whitelistData = thisObj.tfTransformDataToWhiteList(result);
                } else {
                    whitelistData = result;
                }
                thisObj.tagify.settings.whitelist = whitelistData;
                thisObj.tagify.dropdown.show.call(thisObj.tagify, evtValue); // render the suggestions dropdown
            });
    }
};


/**********************clase para el textBox*****************************/

function BackgroundControlTextBox(id, type, code, idParent) {
    BackgroundControl.call(this, id, type, code, idParent);
    // inicialización 
    this.init();
}
// herencia del prototipo de la clase padre
BackgroundControlTextBox.prototype = Object.create(BackgroundControl.prototype);
BackgroundControlTextBox.prototype.constructor = BackgroundControlTextBox;
//inicilizacion
BackgroundControlTextBox.prototype.init = function() {
    this.parentControl = document.getElementById(this.idParent).querySelector('#' + this.id);
    this.control = this.parentControl.querySelector('input');
    if (this.code.trim()) this.control.addEventListener('blur', this.validate.bind(this));
    if (this.parentControl.querySelector('.animated-label')) {
        this.control.id = this.id + '_C';
        this.parentControl.querySelector('.animated-label').htmlFor = this.id + '_C';
    }
};
// obtiene el valor desde el dom
BackgroundControlTextBox.prototype.getValue = function() {
    this._value = this.control.value;
};
// obtiene el valor desde el dom
BackgroundControlTextBox.prototype.setValue = function(value) {
    this.control.value = value;
};
// validacion del valor del campo 
BackgroundControlTextBox.prototype.validate = function() {
    this.Valid = this.control.checkValidity();
    if (this.control.value.trim()) {
        this.control.classList.add('active');
    } else {
        this.control.classList.remove('active');
    }
};

/**********************clase para el textarea*****************************/

function BackgroundControlTextArea(id, type, code, idParent) {
    BackgroundControl.call(this, id, type, code, idParent);
    // inicialización 
    this.init();
}
// herencia del prototipo de la clase padre
BackgroundControlTextArea.prototype = Object.create(BackgroundControl.prototype);
BackgroundControlTextArea.prototype.constructor = BackgroundControlTextArea;
//inicilizacion
BackgroundControlTextArea.prototype.init = function() {
    this.parentControl = document.getElementById(this.idParent).querySelector('#' + this.id);
    this.control = this.parentControl.querySelector('textarea');
};
// obtiene el valor desde el dom
BackgroundControlTextArea.prototype.getValue = function() {
    this._value = this.control.value;
};
// obtiene el valor desde el dom
BackgroundControlTextArea.prototype.setValue = function(value) {
    this.control.value = value;
};
// validacion del valor del campo 
BackgroundControlTextArea.prototype.validate = function() {};

/**********************clase para el select*****************************/

function BackgroundControlSelect(id, type, code, idParent) {
    BackgroundControl.call(this, id, type, code, idParent);
    // inicialización 
    this.init();
}
// herencia del prototipo de la clase padre
BackgroundControlSelect.prototype = Object.create(BackgroundControl.prototype);
BackgroundControlSelect.prototype.constructor = BackgroundControlSelect;
//inicilizacion
BackgroundControlSelect.prototype.init = function() {
    this.parentControl = document.getElementById(this.idParent).querySelector('#' + this.id);
    this.control = this.parentControl.querySelector('select');
};
// obtiene el valor desde el dom
BackgroundControlSelect.prototype.getValue = function() {
    this._value = this.control.value;
};
// obtiene el valor desde el dom
BackgroundControlSelect.prototype.setValue = function(value) {
    this.control.value = value;
};
// validacion del valor del campo 
BackgroundControlSelect.prototype.validate = function() {};
/************************************************************************/

/**********************clase para el switch*****************************/

function BackgroundControlSwitch(id, type, code, idParent) {
    BackgroundControl.call(this, id, type, code, idParent);
    // inicialización 
    this.init();
}
// herencia del prototipo de la clase padre
BackgroundControlSwitch.prototype = Object.create(BackgroundControl.prototype);
BackgroundControlSwitch.prototype.constructor = BackgroundControlSwitch;
//inicilizacion
BackgroundControlSwitch.prototype.init = function() {
    this.parentControl = document.getElementById(this.idParent).querySelector('#' + this.id);
};
// obtiene el valor desde el dom
BackgroundControlSwitch.prototype.getValue = function() {};
// obtiene el valor desde el dom
BackgroundControlSwitch.prototype.setValue = function(value) {};
// validacion del valor del campo 
BackgroundControlSwitch.prototype.validate = function() {};
/************************************************************************/