// clase para embarazo base 

function BasePregnancyBackground(code) {
    Background.call(this, code);
    // en este lugar se guardan los diagnosticos que se ingresen 
    this.diagnostics = [];
    //inicializacion 
    this.initBackground();
    //contador para las copias
    this.count = 0;
}
// herencia del prototipo de la clase padre
BasePregnancyBackground.prototype = Object.create(Background.prototype);
BasePregnancyBackground.prototype.constructor = BasePregnancyBackground;

//metodos
BasePregnancyBackground.prototype.initBackground = function() {
    // listener para el area expandible
    this.control.querySelectorAll('[data-activate]').forEach(function(control) {
        if (control.nodeName === "SELECT") {
            control.addEventListener('change', this.activateVariable.bind(this));
        } else {
            control.addEventListener('click', this.activateVariable.bind(this));
        }
    }, this);
};
// expande el area de diagnosticos
BasePregnancyBackground.prototype.activateVariable = function(e) {
    switch (e.target.closest('[data-control]').id) {
        case 'pre_atpmpd':
            var activeCodes = e.target.dataset.activate.split();
            activeCodes.forEach(function(controlId) {
                var variable = this.controls.find(v => v.id === controlId);
                if (variable) {
                    if (e.target.value !== 'v1') variable.Visible = true;
                    else variable.Visible = false;
                }
            }, this);
            break;
        default:
            var activeCodes = e.target.dataset.activate.split();
            activeCodes.forEach(function(controlId) {
                var variable = this.controls.find(v => v.id === controlId);
                if (variable) variable.Visible = e.target.checked;
            }, this);
            break;
    }
};