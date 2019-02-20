function DropdownScaleVariable() {
	this.id = '';
	this.idScale = '';
	this.active = true;
	this.value = 0;
	this.excludingVariables = null;
	this.checkExclude = false;
	this.selectedItem = '';
}

DropdownScaleVariable.prototype = {
	Init: function (id, idScale, excludingVariables) {
		this.id = id;
		this.idScale = idScale;
		this.excludingVariables = excludingVariables;
		// agrega los listeners
		$('#' + this.id).find("select").change(this.Setvalue.bind(this));
		$('#' + this.id).find('.scse-erase').on('click', this.erase.bind(this));
	},
	Setvalue: function (e) {
		var $option = $(e.target).find("option:selected");
		this.selectedItem = $option.data('itemCode') || "";
		this.value = parseInt($option.data('scaleVarItemValue')) || 0;
		$('#' + this.id).find('[data-scale-var-content="value-field"]').text(this.value);
		if (!this.checkExclude) {
			this.checkExclude = true;
			this.setExcludingsVar(this.idScale, this.excludingVariables);
			$(e.target).parents('.scse-scalevar-container').find('i').addClass('show');
		}
		this.onValueChange(this.idScale);	
	},
	onValueChange: function () { },
	// evento que excluye las variables excluyentes de la variable
	setExcludingsVar: function (idScale, excludingVariables) { },
	erase: function (e) {
		if (e.target.localName === 'i') {
			this.value = 0;
			this.selectedItem = '';
			$('#dd-scale-var-' + this.id).val('default');
			$(e.target).removeClass('show');
			$('#' + this.id).find("select").trigger('change');
			this.checkExclude = false;
			this.setExcludingsVar(this.idScale, this.excludingVariables);
			this.onValueChange(this.idScale);	
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