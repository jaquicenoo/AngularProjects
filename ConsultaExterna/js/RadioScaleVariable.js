// clase para la variable tipo radio Bottom scalas

function RadioScaleVariable() {
	this.id = '';
	this.idScale = '';
	this.active = true;
	this.value = 0;
	this.excludingVariables = null;
	this.selectedItem = '';
	this.checkExclude = false;
}
RadioScaleVariable.prototype = {
	Init: function (id, idScale, excludingVariables) {
		this.id = id;
		this.idScale = idScale;
		this.excludingVariables = excludingVariables;
		// agrega los listeners
		$('#' + this.id).find("input[type='radio']").on('click', this.Setvalue.bind(this));
	},
	Setvalue: function (e) {
		let radio = $(e.target);
		this.checkExclude = true;
		this.selectedItem = radio.data('itemCode').toString();
		//console.log("RadioScaleVariable selectedItem: " + this.selectedItem);
		// avisa al padre que su valor a cambiado
		this.value = parseInt(radio.val());
		this.setExcludingsVar(this.idScale, this.excludingVariables);
		this.onValueChange(this.idScale);
	},
	// evento de cambio de valor 
	onValueChange: function () { },
	// evento que excluye las variables excluyentes de la variable
	setExcludingsVar: function () { },
	erase: function (e) {
		// no aplica
		this.selectedItem = '';
	},
	changeVisibility: function () {
		let control = $('#' + this.id);
		if (control.css('display') === 'block') {
			control.css('display', 'none');
			this.active = false;
		} else {
			control.css('display', 'block');
			this.active = true;
		}
	}
};