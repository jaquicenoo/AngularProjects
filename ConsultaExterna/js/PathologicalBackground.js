// clase para antecedente de patologia 

function PathologicalBackground(code) {
    Background.call(this, code);
    // en este lugar se guardan los diagnosticos que se ingresen 
    this.diagnostics = [];
    //inicializacion 
    this.initBackground();
}
// herencia del prototipo de la clase padre
PathologicalBackground.prototype = Object.create(Background.prototype);
PathologicalBackground.prototype.constructor = PathologicalBackground;

//metodos
PathologicalBackground.prototype.initBackground = function() {
    // listener para el area expandible
    this.control.querySelector('#su_back').querySelectorAll('[type="radio"]').forEach(function(radio) {
        radio.addEventListener('click', this.expandArea.bind(this))
    }, this);
    // listener para agregar un nuevo diagnostico
    this.control.querySelector('.plus-bottom').addEventListener('click', this.addDiagnostic.bind(this));
};

// expande el area de diagnosticos
PathologicalBackground.prototype.expandArea = function(e) {
    if (e.target.id === "si") {
        this.control.querySelector('[data-expand]').classList.remove('hidden');
    } else {
        this.control.querySelector('[data-expand]').classList.add('hidden');
    }
};

// agraga un diagnostico
PathologicalBackground.prototype.addDiagnostic = function() {

};