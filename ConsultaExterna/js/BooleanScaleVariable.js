function BooleanScaleVariable() {
	this.id = '';
	this.idScale = '';
	this.active = true;
	this.value = 0;
	this.excludingVariables = null;
	this.checkExclude = false;
	this.selectedItem = '';
}

BooleanScaleVariable.prototype = {
	Init: function (id, idScale, excludingVariables) {
		this.id = id;
		this.idScale = idScale;
		this.excludingVariables = excludingVariables;
		// agrega los listeners
		$('#' + this.id).find(":checkbox.switch").change(this.Setvalue.bind(this));
	},
	Setvalue: function (e) {
		if ($(e.target).is(":checked")) {
			this.selectedItem = $(e.target).data('itemCode').toString();
			this.value = parseInt($(e.target).data('onTrueValue'));
			$('#' + this.id).find('[data-scale-var-content="value-field"]').text(this.value);
			this.checkExclude = true;
		} else {
			this.selectedItem = '';
			this.value = 0;
			$('#' + this.id).find('[data-scale-var-content="value-field"]').text(this.value);
			this.checkExclude = false;
		}
		//console.log("BooleanScaleVariable selectedItem: " + this.selectedItem);
		this.setExcludingsVar(this.idScale, this.excludingVariables);
		this.onValueChange(this.idScale);
	},
	onValueChange: function () { },
	// evento que excluye las variables excluyentes de la variable
	setExcludingsVar: function (idScale, excludingVariables) { },
	erase: function (e) {
		if (e.target.localName === 'i') {
			this.selectedItem = '';
			const target = $(e.target);
			target.parents('.scse-table').find('tr').removeClass('selected-row');
			this.setExcludingsVar(this.idScale, this.excludingVariables);
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