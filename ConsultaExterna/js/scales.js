
// clase para el componente de escalas

function ScalesComponent() {
	this.treeview = null;
	// escalas de todo el componente
	this.scales = Array();
	this.episode = null;
	// guarda los datos seleccionados por el usuario a los que se les hizo el ultimo guardado parcial
	this.lastPartialSaved = '';
	this.firstsave = true;
	this.jsonApiCollection = null;
	this.saveIntervalMinutes = 1;
	this.jsonApiBaseUrl = '';
	this.patient = null;
    this.selectedScales = new Array();
    this.interpretation = '';
    this.total = null;
}

ScalesComponent.prototype = {
	Init: function (patient) {
		// se inicializan los parametros de la clase
		this.episode = $("#scalesId").data('episode');
		this.jsonApiBaseUrl = $("#scalesId").data('apiBaseUrl');
		this.jsonApiCollection = $("#scalesId").data('apiCollectionName');
		this.saveIntervalMinutes = $("#scalesId").data('saveIntervalMinutes');
		this.firstsave = $("#scalesId").data('firstSave');
        this.patient = patient;
        

		// se inicializan los controles de la clase
		let thisObject = this;

		// treview del componente
		this.treeview = $('#scales-treeview');
		// array de escalas
		let scales = new Array();
		$("[data-scale='true']").each(function () {
			let ListVariables = new Array();
			let scaleId = $(this).data('scaleid');
			let interpretations = $(this).data('interpretations');
			let max = thisObject.getMax(interpretations);
			let min = thisObject.getMin(interpretations);

			// se recorre cada variable de las escalas y se crea el objeto segun el tipo de escala
			$(this).find("[data-variable='true']").each(function () {
				let Control;
				switch ($(this).data('type')) {
					case 'L':
						if ($(this).data('listType') === 'Short') {
							Control = new ListScaleVariable();
						} else { // Long
							Control = new DropdownScaleVariable();
						}
						break;
					case 'R':
						Control = new RadioScaleVariable();
						break;
					case 'C':
						Control = new BooleanScaleVariable();
						break;
					default:
				}
				if (Control) {
					// aca inicializa la variable y setea el evento onValueChange
					Control.Init($(this).attr('id'), scaleId, $(this).data('exclude'));
					Control.onValueChange = thisObject.onValueChange.bind(thisObject);
					Control.setExcludingsVar = thisObject.setExcludingsVar.bind(thisObject);
					ListVariables.push(Control);
				}
			});
			/*
			 * se crea el objeto de escalas que contendra todas las escalas y sus variables
			 * y sus interpretaciones 
			 */
			scales.push(
				{
					id: scaleId,
					barControl: $(this).data('idpb'),
					formule: $(this).data('formule'),
					variables: ListVariables,
					interpretations: $(this).data('interpretations'),
					max: max,
					min: min,
                    value: 0,
                    total: 0,
                    interpretation: '',
                    observation: ''
				}
			);

			// se inicializa el scorebar y se crea la grilla de la scala

			let progress = $('#' + scaleId).find('.scse-scale-score ul');

			let step = Math.round((max - min) / 10, 1);

			progress.append($("<li>").attr('data-before', min));
			for (var i = min + step; i < max; i += step) {
				var li = $("<li>");
				li.attr('data-before', i);
				progress.append(li);
			}
			progress.append($("<li>").attr('data-before', max));
		});
		this.scales = scales;

		// aqui se agregar los listeners
		this.treeview.find('li').on('click', this.selectedClass);
		// se comenta el evento de agregar la escala, ya no es necesario
		//this.treeview.find('i').on('click', this.addScale.bind(this));

		// se activa el primer tab
		$(this.treeview.find('li span')[1]).trigger("click");

		// inicializar los items seleccionados formulario
		$('*[data-scale-item-is-selected="true"]').each(function () {
			if ($(this).is('option')) {
				$(this).prop("selected", true);
				$(this).parent().change();
			} else {
				$(this).click();
			}

		});

		// se inicializa el intervalo de guardado parcial
		this.startScalesPartialSaveInterval();
	},
	startScalesPartialSaveInterval: function () {
		let thisObj = this;
		setInterval(function () { thisObj.componentPartialSave(); }, thisObj.saveIntervalMinutes * 60000);
	},
	componentPartialSave: async function () {
		let userSelectedData = this.getUserSelectedData();
		let thisObj = this;
		//let jsonObjToPartialSave = {
		//	Episode: this.episode,
		//	Section: this.jsonApiCollection,
		//	JsonData: JSON.stringify(userSelectedData)
		//};

        let jsonObjToPartialSave = createPartialSaveObject(this.episode, this.jsonApiCollection, userSelectedData);

		// solo se guarda si han cambiado las selecciones del usuario
        if (this.lastPartialSaved !== JSON.stringify(jsonObjToPartialSave)) {
            var method = 'POST';
            if (!this.firstsave) {
                method = 'PUT';
            }

            var result = await SendPartialSavedData2(jsonObjToPartialSave, method, 'text');
            if (result) {
                thisObj.lastPartialSaved = JSON.stringify(jsonObjToPartialSave);
                thisObj.firstsave = false;
            }

            console.log('revisions result: ' + result);
            return result;
		}
	},
	getUserSelectedData: function () {
        let jsonSelectedData = {
			Scales: []
        };
        //this.observation = $('#' + idScale).find('#int_' + idScale);
		let scalesSelected = this.scales.filter(sc => sc.variables.filter(v => v.selectedItem !== '').length > 0);
        scalesSelected.forEach(function (oneScale) {
            var dd = $('#' + oneScale.id).find('#obs_' + oneScale.id);
            jsonScale = {
                Total: oneScale.total,
                ScaleInterpretation: oneScale.interpretation ? oneScale.interpretation.Percentage:"",
                ScaleObservation: $('#' + oneScale.id).find('#obs_' + oneScale.id).val(),
				Code: oneScale.id,
				Variables: []
			};
			let variablesSelected = oneScale.variables.filter(v => v.selectedItem !== '');
			variablesSelected.forEach(function (oneVar) {
				jsonScale.Variables.push({ Code: oneVar.id, SelectedItem: oneVar.selectedItem, Value: oneVar.value });
			});
			jsonSelectedData.Scales.push(jsonScale);
		});
		return jsonSelectedData;
	},
	addScale: function (e) {
		// agrega la escala para el reporte
		let parent = $(e.target).parents('li');
		if (!parent.hasClass('scse-active')) {
			parent.addClass('scse-active');
			parent.removeClass('scse-inactive');
		} else {
			parent.removeClass('scse-active');
			parent.addClass('scse-inactive');
		}
	},
	selectedClass: function (e) {
		// agrega la clase que deja seleccionado una scala en el treeview
		//if (e.target.localName === 'i') return;
		$(this).parent().find('li').removeClass('selected');
		$(this).addClass('selected');
	},
	onValueChange: function (idParent) {
		// Actualiza el icono del treeview que indica si tiene datos diligenciados
		this.refreshTreeviewScale(idParent);
		// Calcula la formula si existe, de lo contrario suma
		this.calculateFormule(idParent);
	},
	refreshTreeviewScale: function (idParent) {
		let scale = this.getScale(idParent);
		let variables = scale.variables.filter(v => v.selectedItem !== '');
		let tabScale = this.treeview.find('a[href="#' + idParent + '"]').parent();
		if (variables.length > 0 && !tabScale.hasClass('scse-active')) {
			tabScale.addClass('scse-active');
			tabScale.removeClass('scse-inactive');
		} else if (variables.length === 0) {
			tabScale.removeClass('scse-active');
			tabScale.addClass('scse-inactive');
		}
	},
	calculateFormule: function (idParent) {
		// esta funcion la llama el objeto de la variable
		let scale = this.getScale(idParent);
		let isValid = false;
		let result = 0;
		let patient = this.patient;
		let avaliableVars = scale.variables.filter((variable) => variable.active && variable.checkExclude);
        if (scale && avaliableVars.length > 0) {
            let formule = scale.formule;
            // si la formula es null o empty se suman todos los valores de las variables
            if (!formule.trim()) {
                isValid = true;
                $.each(avaliableVars, function (index, value) {
                    result += value.value;
                });
            }
            else {
				/*
				 * se obtienen todas las variables de la formula y se emparejan con los
				 * valores de las variables despues se remplazan esos valores y se realiza el 
				 * calculo de la formula con la libreria math.js
				 */
                var matches = formule.match(/([^[\]]+(?=])|\b(\w*(Age|Weight|Size)\w*)\b)/g);
                $.each(matches, function (index, value) {
                    let val = scale.variables.find((variable) => variable.id === value);
                    if (val !== undefined) {
                        formule = formule.replace(`[${value}]`, val.value);
                    } else if (patient.hasOwnProperty(value)) {
                        val = this.patient[value];
                        formule = formule.replace(`${value}`, val);
                    }
                });
                var expr = math.parse(formule);
                const code1 = expr.compile();
                result = code1.eval();
                if (typeof result === 'number') {
                    isValid = true;
                }
            }
        }
		if (!isValid) result = scale.min;
		// setea el scoreBar y las interpretaciones
        scale.total = result;
		this.setProgress(result, scale, isValid);
	},
	getScale: function (idScale) {
		let scale;
		$.each(this.scales, function (index, value) {
			if (value.id === idScale) {
				scale = value;
				return false;
			}
		});
		return scale;
	},
	setProgress: function (progressVal, scale, isValid) {

		// calcula el progreso segun los limintes de la escala

		let topScore = Math.abs(scale.min - scale.max);
		let rateScore = Math.abs(scale.min - progressVal) * 100;
        let interpretation = this.getInterpretation(progressVal, scale);
        scale.interpretation = interpretation;
		let scoreBar = $('#' + scale.barControl).find('.progress-bar');
		scoreBar.width(rateScore / topScore + '%');
		/*
		 * setea el color y la interpretacion segun la interpretacion obtenida
		 * con el valor calculado
		 */
		if (interpretation && isValid) {
			scoreBar.css('background-color', 'rgb(' + interpretation.ColorAlarm + ')');
			this.setInterpretation(scale.id, interpretation.Percentage);
		} else {
            this.setInterpretation(scale.id, null);
            $('#' + scale.id).find('#obs_' + scale.id).val('');
		}
	},
	getMax: function (interpretations) {
		let max = interpretations[0] !== undefined ? interpretations[0].FinalScore: 10;
		$.each(interpretations, function (index, value) {
			if (value.FinalScore > max) {
				max = value.FinalScore;
			}
		});
		if (max) {
			max = parseInt(max);
		} 
		return max;
	},
	getMin: function (interpretations) {
		let min = interpretations[0] !== undefined ? interpretations[0].InitialScore :0;
		$.each(interpretations, function (index, value) {
			if (value.InitialScore < min) {
				min = value.InitialScore;
			}
		});
		if (min) {
			min = parseInt(min);
		} 
		return min;
	},
	getInterpretation: function (scoreValue,scale) {
		let interpretation;
        $.each(scale.interpretations, function (index, value) {
            if (scoreValue >= value.InitialScore && scoreValue <= value.FinalScore) {
                interpretation = value;
                return false;
            }
        });
		return interpretation;
	},
	setInterpretation: function (idScale, interpretation) {
        var spanInter = $('#' + idScale).find('#int_' + idScale);        
		spanInter.text(interpretation);
		//spanInter.css('background-color', 'rgb(' + interpretation.ColorAlarm + ')');
	},
	setExcludingsVar: function (idScale, excludeVariables) {
		let scale = this.getScale(idScale);
		if (excludeVariables !== null && excludeVariables.length !== 0) {
			$.each(scale.variables, function (index, value) {
				if (excludeVariables.includes(value.id)) {
					value.changeVisibility();
				}
			});
		}
	}
};