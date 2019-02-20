// clase para la variable tipo lista corta componente scales

function ListScaleVariable() {
	this.id = '';
	this.idScale = '';
	this.active = true;
	this.value = 0;
	this.excludingVariables = null;
	this.checkExclude = false;
	this.selectedItem = '';
}
 
ListScaleVariable.prototype = {
	Init: function (id, idScale, excludingVariables ) {
		this.id = id;
		this.idScale = idScale;
		this.excludingVariables = excludingVariables;
		// agrega los listeners
		$('#' + this.id).find('.scse-table tr').on('click', this.Setvalue.bind(this));
		$('#' + this.id).find('.scse-table th').find('i').on('click', this.erase.bind(this));
	},
	Setvalue: function (e) {
		/*
		 * agrega la clase para que se vea el valor y avisa al padre
		 * que su valor a cambiado
		 */
		if (e.target.localName === 'td') {
			const target = $(e.target);
			this.selectedItem = target.parent().data('itemCode').toString();
			//console.log("ListScaleVariable selectedItem: " + this.selectedItem);
			target.parents('.scse-table').find('tr').removeClass('selected-row');
			target.parent().addClass('selected-row');
			this.value = parseInt(target.parent().attr('value'));
			if (!this.checkExclude) {
				this.setExcludingsVar(this.idScale, this.excludingVariables);
				this.checkExclude = true;
			} 
			this.onValueChange(this.idScale);
			target.parents('.scse-table').find('i').addClass('show');
		}
	},
	// evento de cambio de valor 
	onValueChange: function () { },
	// evento que excluye las variables excluyentes de la variable
	setExcludingsVar: function (idScale, excludingVariables) { },
	erase: function (e) {
		if (e.target.localName === 'i') {
			this.value = 0;
			this.selectedItem = '';
			const target = $(e.target);
			target.parents('.scse-table').find('tr').removeClass('selected-row');
			this.checkExclude = false;
			this.setExcludingsVar(this.idScale, this.excludingVariables);
			this.onValueChange(this.idScale);
			target.removeClass('show');
		}
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