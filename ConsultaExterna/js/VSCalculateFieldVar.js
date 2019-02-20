// clase para la variable de campo calculado 

function VSCalculateFieldVar(type, code, min, max, alerts, dependences, unids, patient, formule, getVariableFunc, apiBaseGrowtPattern) {
	// herencia de la clase padre
	VitalSignsVar.call(this, type, code, min, max, alerts, dependences, unids, patient);
	// campos usados para el calculo de la formula
	this.formule = formule;
	this.getVariable = getVariableFunc;
	this.apiBaseGrowtPattern = apiBaseGrowtPattern;
}

// herencia del prototipo de la clase padre
VSCalculateFieldVar.prototype = Object.create(VitalSignsVar.prototype);
VSCalculateFieldVar.prototype.constructor = VSCalculateFieldVar;

VSCalculateFieldVar.prototype.initControl = function () {
	this.addFormuleWatcher();
};

VSCalculateFieldVar.prototype.addFormuleWatcher = function () {
	if (!this.control.classList.contains("hidden")) {
		var replacedFormula = this.formule.trim();
		if (replacedFormula.length > 0) {
			var matches = replacedFormula.match(/([^[\]]+(?=]))/g);
			if (matches === null) return;
			matches.forEach(function (match) {
				this.addWatcher('VS_' + match, this.handlerWatch.bind(this));
			}, this);
		}
	}
};


function replaceVBFuntionsToMathjsFunctions(formule) {
	var resultFormula = formule.trim();
	if (resultFormula.length > 0) {
		resultFormula = resultFormula.replace("Math.Round", "round");
		resultFormula = resultFormula.replace("CInt", "round");
		resultFormula = resultFormula.replace("Math.Sqrt", "sqrt");
		resultFormula = resultFormula.replace("Math.Abs", "abs");
		resultFormula = resultFormula.replace("Math.Log", "log");
		resultFormula = resultFormula.replace("Math.Exp", "exp");
		resultFormula = resultFormula.replace("Math.Truncate", "fix");
		// si usa: (expresion).Truncate()
		/*var numMatches = 0;
		do {
			var matches = resultFormula.match(/\([^(]+\).Truncate\(\)/g);
			matches.forEach(function (match) {
				resultFormula = resultFormula.replace(match, "fix" + match.replace(".Truncate()", ""));
			});
			numMatches = matches.length;
		} while (numMatches > 0);
		*/
	}
	return resultFormula;
}

// calculo de la formula
VSCalculateFieldVar.prototype.calculateFormule = function () {
	return new Promise(function() {
		// calculo
		var result = 0;
		var replacedFormula = replaceVBFuntionsToMathjsFunctions(this.formule);
		var thisObj = this;

		/*
		* se obtienen todas las variables de la formula y se emparejan con los
		* valores de las variables, despues se remplazan esos valores y se realiza el 
		* calculo de la formula con la libreria math.js
		*/
		if (replacedFormula.length > 0) {
			if (replacedFormula.indexOf('{"API":{') === 0) { // la cadena inicia con el texto "API{"
				var apiData = JSON.parse(replacedFormula);
				var apiResult = this.getApiData(apiData.API);
				if (apiResult.isSuccess) {
					result = apiResult.result;
				} else {
					console.log(apiResult.statusMessage);
					result = null;
				}
			}
			else {
				var matches = replacedFormula.match(/([^[\]]+(?=])|\b(\w*(Age|Weight|Size)\w*)\b)/g);
				var allVariablesReady = true;
				$.each(matches, function (index, match) {// match de cada nombre de variable (value: nombre o codigo de la variable)
					var variable = thisObj.getVariable('VS_' + match);
					var val = '';
					if (variable !== null) {
						if (variable.Value !== null && variable.isValid) {
							val = ConvertUnitsOnControlVariables(match, variable.unids, variable.Value);
							replacedFormula = replacedFormula.replace(`[${match}]`, val);
						} else {
							allVariablesReady = false;
						}
					} else if (thisObj.Patient.hasOwnProperty(match)) {
						if (thisObj.Patient[match] !== null) {
							val = thisObj.Patient[match];
							replacedFormula = replacedFormula.replace(`${match}`, val);
						} else {
							allVariablesReady = false;
						}
					}
				});
				if (allVariablesReady) {
					var expr = math.parse(replacedFormula);
					const code1 = expr.compile();
					result = code1.eval();
				} else {
					result = null;
				}
			}
			if (typeof result === 'number' && result !== Infinity) {
				this.Value = result;
			} else {
				this.Value = null;
			}
		}
	}.bind(this));
};

function ConvertUnitsOnControlVariables(varCode, varUnits, varValue) {
	var varResult = varValue;
	if (varUnits !== null) {
		if (varUnits.CodeUnit !== null) {
			switch (varCode) {
				case "PESO":
					// pasa de Gramos a Kilogramos
					if (varUnits.CodeUnit === "G") {
						varResult = varValue / 1000;
					}
					break;
				case "TALLA":
					// pasa de Metros a Centimetros
					if (varUnits.CodeUnit === "M") {
						varResult = varValue * 100;
					}
					break;
			}
		}
	}
	return varResult;
}

VSCalculateFieldVar.prototype.getApiData = function (parameters) {
	var JsResult = { isSuccess: false, statusMessage:"Variables incompletas o nulas", result: null };
	var queryString = parameters.MethodParameters;
	var url = this.apiBaseGrowtPattern + "/" + parameters.Method + "?";
	var allVariablesReady = true;

	// matches de variables de signos vitales
	var matches = queryString.match(/([^[\]]+(?=]))/g);
	if (matches !== null) {
		matches.forEach(function (match) {
			var variable = this.getVariable('VS_' + match);
			if (variable !== null) {
				if (variable.Value !== null && variable.isValid) {
					var varValue = ConvertUnitsOnControlVariables(match, variable.unids, variable.Value);
					queryString = queryString.replace(`[${match}]`, varValue);
				} else {
					allVariablesReady = false;
				}
			} else {
				allVariablesReady = false;
			}
		}, this);
	}
	// match de variables del paciente
	// /{([^}]*)}/g    incluye las llaves
	// /(?<=\{)(.*?)(?=\})/g
	if (allVariablesReady) {
		matches = queryString.match(/(?<=\{)(.*?)(?=\})/g);
		if (matches !== null) {
			matches.forEach(function (match) {
				if (this.Patient.hasOwnProperty(match)) {
					if (this.Patient[match] !== null) {
						queryString = queryString.replace(`{${match}}`, this.Patient[match]);
					} else {
						allVariablesReady = false;
					}
				} else {
					allVariablesReady = false;
				}
			}, this);
		}
	}

	if (allVariablesReady) {

		url = url + queryString;

		var result = $.ajax({
			async: false,
			url: url,
			type: "GET",
			contentType: 'application/json',
			success: function (d) {
				JsResult = d;
			},
			error: function (err) {
				//console.log("GET ERROR codigo(" + err.status + "): " + err.statusText);
				JsResult.isSuccess = false;
				JsResult.statusMessage = "GET ERROR codigo(" + err.status + "): " + err.statusText;
				JsResult.result = 0;
			}
		});
	}

	return JsResult;
};

// metodos sobreescritos 
VSCalculateFieldVar.prototype.validate = function () {
	return new Promise(function () {
		var inputVal = this.control.querySelector('input').value;

		// si no tiene nada no hace nada
		//if (!inputVal.trim()) return;

		var numericVal = parseFloat(inputVal);

		if (numericVal >= parseFloat(this.min) && numericVal <= parseFloat(this.max)) {
			this.isValid = true;
		} else {
			this.isValid = false;
			this.showAlert(`el valor debe estar entre ${this.min} y ${this.max}`);
		}
	}.bind(this));
};

VSCalculateFieldVar.prototype.handlerWatch = async function (evt) {
	//let errorMs = this.control.querySelector('.scse-alert');
	try {
		//errorMs.querySelector('i').className = 'fas fa-spinner fa-spin';
		//errorMs.classList.add('spinner');
		await this.calculateFormule();	
		await this.validate();
		//errorMs.querySelector('i').className = 'fas fa-times';
		//errorMs.classList.remove('spinner');
	} catch (e) {
		console.log(e.message);
	}
	//errorMs.querySelector('i').className = 'fas fa-times';
	//errorMs.classList.remove('spinner');
};

VSCalculateFieldVar.prototype.showValue = function () {
	// override
	//console.log(this.code + "(show): " + this.Value);
	if (this.Value) {
		this.control.querySelector('input').value = this.Value;
		this.control.querySelector('input').classList.add('active');
	} else {
		this.control.querySelector('input').value = "";
		this.control.querySelector('input').classList.remove('active');
	}
};