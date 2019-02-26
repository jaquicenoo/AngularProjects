// clase para embarazo base 

function BasePregnancyBackground(code) {
    Background.call(this, code);
    // en este lugar se guardan los diagnosticos que se ingresen 
    this.diagnostics = [];
    //contador para las copias
    this.count = 0;
    //tabla de examanes
    this.table = null;
    //inicializacion 
    this.initBackground();
}
// herencia del prototipo de la clase padre
BasePregnancyBackground.prototype = Object.create(Background.prototype);
BasePregnancyBackground.prototype.constructor = BasePregnancyBackground;

//metodos
BasePregnancyBackground.prototype.initBackground = function() {
    // adignacion de la tabla de examenes
    this.table = this.control.querySelector('.bp-tablexam');
    // listener para el area expandible
    this.control.querySelectorAll('[data-activate]').forEach(function(control) {
        if (control.nodeName === "SELECT") {
            control.addEventListener('change', this.activateVariable.bind(this));
        } else {
            control.addEventListener('click', this.activateVariable.bind(this));
        }
    }, this);
    // listener para los input en la tabla 
    this.table.querySelector('.group-data').querySelectorAll('input').forEach(function(input) {
        input.addEventListener('focus', this.markupRow.bind(this));
        input.addEventListener('blur', this.markupRow.bind(this));
    }, this);
    // listener para los campos que suman algun valor
    this.control.querySelectorAll('[data-sum]').forEach(function(control) {
        if (control.nodeName === "CHECKBOX") {
            control.addEventListener('click', this.summaryze.bind(this));
        } else {
            control.addEventListener('change', this.summaryze.bind(this));
        }

    }, this);

};
// expande el area de diagnosticos
BasePregnancyBackground.prototype.activateVariable = function(e) {
    var activeCodes;
    switch (e.target.closest('[data-control]').id) {
        case 'pre_atpmpd':
            activeCodes = e.target.dataset.activate.split();
            activeCodes.forEach(function(controlId) {
                var variable = this.controls.find(v => v.id === controlId);
                if (variable) {
                    if (e.target.value !== 'v1') variable.Visible = true;
                    else variable.Visible = false;
                }
            }, this);
            break;
        case 'pre_swbtm':
            if (e.target.checked) {
                this.control.querySelector('#' + e.target.dataset.activate).classList.remove('hidden');
            } else {
                this.control.querySelector('#' + e.target.dataset.activate).classList.add('hidden');
            }
            break;
        default:
            activeCodes = e.target.dataset.activate.split();
            activeCodes.forEach(function(controlId) {
                var variable = this.controls.find(v => v.id === controlId);
                if (variable) variable.Visible = e.target.checked;
            }, this);
            break;
    }
};
// suma los campos dependiente 
BasePregnancyBackground.prototype.summaryze = async function(e) {
    // se obtien las variables de las quemodifica
    e.target.dataset.sum.split(',').forEach(function(idvar) {
        // se obtiene la variable a la que se le desea sumar 
        var variable = this.controls.find(v => v.id === idvar);
        var value = 0;
        var multiplier = 1;
        // toma las variables de las que depende
        this.control.querySelectorAll('[data-sum]').forEach(function(control) {
            if (!control.dataset.sum.match(idvar)) return;
            var currentVar = this.controls.find(v => v.id === control.closest('[data-control]').id);
            // se aplica el multiplicador si es el caso
            if (control.dataset.aplimul && control.dataset.aplimul === variable.id) {
                multiplier = parseInt(control.dataset.multi);
            }
            // verifica si la variable es valida y si tiene un valor valido
            if (currentVar instanceof(BackgroundControlSwitch)) {
                value += control.checked ? 1 : 0;
                return;
            }
            if (variable && currentVar && control.checkValidity() && control.value) {
                value += parseInt(control.value) * multiplier;
            }

        }, this);
        if (variable.id === 'pre_totp') {
            var gestas = this.controls.find(v => v.id === 'pre_gesa');
            if (value != parseInt(gestas.Value)) {
                variable.control.setCustomValidity('El valor debe ser igual al numero de gestas');
            } else {
                variable.control.setCustomValidity('');
            }
        }
        if (variable.id === 'pre_gesa') {
            var totalpartos = this.controls.find(v => v.id === 'pre_totp');
            if (totalpartos.Value && value != parseInt(totalpartos.Value)) {
                totalpartos.control.setCustomValidity('El valor debe ser igual al numero de gestas');
                totalpartos.Valid = false;
            } else {
                totalpartos.control.setCustomValidity('');
            }
        }
        variable.Value = value;
        variable.control.dispatchEvent(new Event('change', { bubbles: true }));
    }, this);
};
// resaltalos elementos en la tabla 
BasePregnancyBackground.prototype.markupRow = function(e) {
    // obtiene la posicion en el grid del header y el nombre de la variable
    var row = e.target.parentElement.dataset.row;
    var col = e.target.parentElement.dataset.col;
    var varname = this.table.querySelector('.group-var').querySelector('[data-row="' + row + '"]');
    // se agreca el estilo al nobre de la variable y la columna
    if (e.type === "focus") {
        this.table.querySelector('.header').querySelector('[data-col="' + col + '"]').classList.add('active');
        varname.classList.add('active');
        this.table.querySelector('.group-var').querySelector('.' + varname.dataset.parent).classList.add('active');
    } else {
        this.table.querySelector('.header').querySelector('[data-col="' + col + '"]').classList.remove('active');
        varname.classList.remove('active');
        this.table.querySelector('.group-var').querySelector('.' + varname.dataset.parent).classList.remove('active');
    }

};