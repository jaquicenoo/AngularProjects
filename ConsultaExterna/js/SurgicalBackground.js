// clase para antecedente quirurgicos 

function SurgicalBackground(code) {
    Background.call(this, code);
    // en este lugar se guardan los diagnosticos que se ingresen 
    this.diagnostics = [];
    //inicializacion 
    this.initBackground();
    //contador para las copias
    this.count = 0;
}
// herencia del prototipo de la clase padre
SurgicalBackground.prototype = Object.create(Background.prototype);
SurgicalBackground.prototype.constructor = SurgicalBackground;
// init de quirurgicos
//metodos
SurgicalBackground.prototype.initBackground = function() {
    // listener para el area expandible
    this.control.querySelector('#su_back').querySelectorAll('[type="radio"]').forEach(function(radio) {
        radio.addEventListener('click', this.expandArea.bind(this))
    }, this);
    // listener para agregar un nuevo diagnostico
    this.control.querySelector('.plus-bottom').addEventListener('click', this.addDiagnostic.bind(this));
};

// expande el area de diagnosticos
SurgicalBackground.prototype.expandArea = function(e) {
    if (e.target.id === "suc_si") {
        this.control.querySelectorAll('[data-expand]').forEach(function(control) {
            control.classList.remove('hidden');
        })
    } else {
        this.control.querySelectorAll('[data-expand]').forEach(function(control) {
            control.classList.add('hidden');
        })
    }
};

// agraga un diagnostico
SurgicalBackground.prototype.addDiagnostic = function() {
    // control oculto que se clona
    var Control = this.control.querySelector('[data-clone]');
    // clone
    var ControlClone = Control.cloneNode(true);
    ControlClone.dataset.expand = "";
    ControlClone.classList.remove('hidden');
    Control.parentElement.appendChild(ControlClone);
    // ControlClone.querySelector('.plus-bottom').addEventListener('click', this.removeDiagnostic.bind(this));
    ControlClone.querySelectorAll('[data-control-clone]').forEach(function(variable) {
        var controlid = variable.dataset.code;
        // deja de ser un clone
        delete variable.dataset.controlClone;
        variable.dataset.control = "";
        var input = variable.querySelector('[data-idcontrol="' + controlid + '"]');
        variable.id = 'su_' + controlid + this.count;
        variable.dataset.code = 'suc_' + controlid + this.count;
        input.id = 'suc_' + controlid + this.count;
        input.name = 'suc_' + controlid + this.count;
        delete input.dataset.idcontrol;
        // seteo de valores y limpia las variables
        var backControl = new BackgroundControl(variable.id, variable.dataset.type, variable.dataset.code, this.code);
        var varToSet = this.controls.find(v => v.id === 'su_' + controlid);
        // el bacground control se encargadel set de cada control
        backControl.Value = varToSet.Value;
        varToSet.Value = null;
        this.controls.push(backControl);
    }, this);
    this.count++;
};
// borrado de diagnosticos 
SurgicalBackground.prototype.removeDiagnostic = function(e) {
    var parent = e.target.closest('[data-clone]');
    parent.querySelectorAll('[data-control]').forEach(function(control) {
        var control = this.controls.find(v => v.code === control.dataset.code);
        if (control) {
            var index = this.controls.indexOf(control);
            delete this.controls[index];
            this.controls.splice(index, 1);
        }
    }, this);
    parent.remove();
};