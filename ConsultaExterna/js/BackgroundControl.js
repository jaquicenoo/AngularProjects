// clase generica para los controles 

function BackgroundControl(id, type, code, idParent) {
    this.id = id;
    this.code = code;
    this.idParent = idParent;
    this.type = type;
    this.control = null;
    this._valid = true;
    this._value = null;
    this._visible = true;
    // inicialización 
    this.init();
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
    },
    get Value() {
        return this.getValueBytype();
    },
    set Value(value) {
        this._value = value;
        this.setValueBytype(value);
    }
};
// control init 
BackgroundControl.prototype.init = function() {
    this.control = document.getElementById(this.idParent).querySelector('#' + this.id);
    if (this.control.dataset.type === "TF") {
        this.tagify = new Tagify(this.control.querySelector('input'), {
            whitelist: [],
            dropdown: {
                enabled: 1
            }
        });
    }
};

// obtiene el valor segun el tipo de control
BackgroundControl.prototype.getValueBytype = function() {

    switch (this.type) {
        case 'GB':
            this._value = this.control.querySelector('input [type="radio"]:cheked').value;
            break;
        case 'TF':
            this._value = this.tagify.value;
            break;
        case 'TB':
            this._value = this.control.querySelector('input').value;
            break;
        case 'TA':
            this._value = this.control.querySelector('textarea').value;
            break;
        case 'SE':
            this._value = this.control.querySelector('select').value;
            break;
        default:
    }
    return this._value;
};
// setea el valor segun el tipo de control
BackgroundControl.prototype.setValueBytype = function(value) {

    switch (this.type) {
        case 'GB':
            this.control.querySelector('input [type="radio"]:cheked').value = value;
            break;
        case 'TF':
            this.tagify.removeAllTags();
            if (!value) return;
            value.forEach(tag => {
                this.tagify.addTags(tag.value);
            }, this);
            break;
        case 'TB':
            this.control.querySelector('input').value = value;
            break;
        case 'TA':
            this.control.querySelector('textarea').value = value;
            break;
        case 'SE':
            this.control.querySelector('select').value = value;
            break;
        default:
    }
};

// setea la visibilidad del control
BackgroundControl.prototype.changeVisibility = function() {
    if (this.Visible) {
        this.control.parentElement.classList.remove('hidden');
    } else {
        this.control.parentElement.classList.add('hidden');
    }
};