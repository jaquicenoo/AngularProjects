function ExternalCauseInjuriesComponent(container) {
    this.component = container;
    this.episode;
    this.firstSave;
    this.jsonApiUrl;
    this.jsonApiCollection;
    this.lastSaved;
    this.saveIntervalMinutes;
    this.bcItemId;

    $(this.component).find('textarea[data-required="True"]').blur(function (e) {
        this.Validate(e);
    }.bind(this));
    $(this.component).find('input[data-required="True"]').blur(function (e) {
        this.Validate(e);
    }.bind(this));

    today = getDateFormated(new Date());
    var birth = ExternConsult.externalConsultData.HealtRegister.Patient.Info.BirthDate.split('T')[0];
    $.each($(this.component).find('input[type="date"]'), function (index, value) {
        value.setAttribute("max", today)
        value.setAttribute("min", birth)
    });

    $(this.component).find('input[type="date"]').blur(function (e) {
        this.ValidateDate(e);
    }.bind(this));

}

ExternalCauseInjuriesComponent.prototype = {
    Init: function () {

        this.episode = this.component.data('episode');
        this.firstSave = this.component.data('firstSave');
        this.jsonApiUrl = this.component.data('apiBaseUrl');
        this.jsonApiCollection = this.component.data('collectionName');
        this.lastSaved = JSON.stringify(this.component.data("lastsaved"));
        this.saveIntervalMinutes = this.component.data('saveIntervalMinutes');
        this.bcItemId = this.component.closest(`[data-isparentcontainer="true"]`).data('bcitemid');
        this.startPartialSaveInterval();

        var header = $('#idExternalCauseInjuries').find(".ExpandableTextArea");
        for (var i = 0; i < header.length; i++) {
            var h = new ExpandableTextArea(header[i]);
        }
    },


    startPartialSaveInterval: function () {
        let thisObj = this;
        setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 60000);
    },

    ComponentPartialSave: async function () {

        var causes = [];

        this.component.find(":checkbox[name='cause']:checked").each(function () {
            causes.push($(this).attr('value'));
        });

        var jsonData = {
            NotificationDate: this.component.find('#externalCauseInjury-notificationDate input').val(),
            IncidenceDate: this.component.find('#externalCauseInjury-incidenceDate input').val(),
            ConsultationDate: this.component.find('#externalCauseInjury-consultationDate input').val(),
            InjuryImpact: this.component.find('#externalCauseInjury-injuryImpact select').val(),
            Zone: this.component.find('#externalCauseInjury-radio-zone input:radio:checked').val(),
            IncomeStatus: this.component.find('#externalCauseInjury-incomeStatus select').val(),
            Mechanism: this.component.find('#externalCauseInjury-mechanism select').val(),
            Activity: this.component.find('#externalCauseInjury-activity select').val(),
            OcurrencePlace: this.component.find('#externalCauseInjury-ocurrencePlace input').val(),
            AlcoholConsumption: this.component.find('#externalCauseInjury-alcoholComsumption input:checkbox').is(':checked'),
            AnotherSubstance: this.component.find('#externalCauseInjury-anotherSubstance input:checkbox').is(':checked'),
            Hospitalized: this.component.find('#externalCauseInjury-hospitalize input:checkbox').is(':checked'),
            PsychoSubstanceonsumption: this.component.find('#externalCauseInjury-PsychoSubstanceonsumption input:checkbox').is(':checked'),
            Complainted: this.component.find('#externalCauseInjury-complainted input:checkbox').is(':checked'),
            PatientCondition: this.component.find('#externalCauseInjury-radio-patientcondition input:radio:checked').val(),
            EventDescription: this.component.find('#externalCauseInjury-eventDescription').val(),
            IsWorkAccident: this.component.find('#externalCauseInjury-isWorkAccident input:checkbox').val() ? this.component.find('#externalCauseInjury-isWorkAccident input:checkbox').is('checked') : false,
            ActivityDescription: this.component.find('#externalCauseInjury-activityDescription') ? this.component.find('#externalCauseInjury-activityDescription').val() : ""
        };

        $jsonObj = createPartialSaveObject(this.episode, this.jsonApiCollection, jsonData);
        if ($jsonObj === null) {
            console.log('json bad format');
            return;
        }

        $jsonObj = createPartialSaveObject(this.episode, this.jsonApiCollection, jsonData);
        if ($jsonObj === null) {
            console.log('json bad format');
            return;
        }

        if (JSON.stringify($jsonObj) !== this.lastsaved) {
            var method = 'POST';
            var url = this.jsonApiUrl;
            if (!this.firstSave) {
                method = 'PUT';
                url = this.jsonApiUrl + this.episode + "/" + this.jsonApiCollection;
            }

            //var result = await SendPartialSavedData(url, $jsonObj, method, 'text');
            //if (result) {
            //    this.component.data("lastsaved", $jsonObj);
            //    this.component.data('firstSave', false);
            //    this.firstSave = false;
            //}

            var result = await SendPartialSavedData2($jsonObj, method, 'text');
            if (result) {
                this.component.data("lastsaved", $jsonObj);
                this.component.data('firstSave', false);
                this.firstSave = false;
            }


            return result;
        }
    },

    Validate: function (e) {
        if ($(e.target).val().length === 0) {
            this.AddTargetError(e.target,"Campo Obligatorio");
        }
        else {
            this.RemoveTargetError(e.target)
        }
    },
    AddTargetError: function (target,msg) {
        $(target).addClass('IsWrong');
        ShowMyError(target, msg);
        this.AddBcError();
     },
    RemoveTargetError: function (target) {
        $(target).removeClass('IsWrong');
        $(target).tooltip('dispose');
        this.RemoveBcError();
    },
    AddBcError: function () {
        $("#" + this.bcItemId).addClass('bcError');
        this.IsComponentValid = false;
    },
    RemoveBcError: function () {
        var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
        if (container) {
            var errors = $(container).find('.IsWrong');
            if (errors.length === 0)
                $("#" + this.bcItemId).removeClass('bcError');
        }

    },
    ValidateDate: function (e) {
        if (e.target.value == null || e.target.value == "") {
            this.AddTargetError(e.target, "Campo Obligatorio");

        }
        else {
            this.RemoveTargetError(e.target)
           
            componentDate = new Date(e.target.value.replace('-', ' '))
            minDate = new Date(e.target.min.replace('-', ' '));
            maxDate = new Date(e.target.max.replace('-', ' '));
            if (minDate <= componentDate && maxDate >= componentDate) {
                switch (e.target.id) {
                    case "IncidenceDate":
                        compareDate = new Date($(this.component).find('#ConsultationDate').val().replace('-', ' '))
                        if (compareDate < componentDate) {
                            this.AddTargetError(e.target, "La fecha de ocurrencia debe ser menor a la de consulta");
                        } else {
                            this.RemoveTargetError(e.target);
                        }
                        break;
                    case "ConsultationDate":
                        compareDate = new Date($(this.component).find('#IncidenceDate').val().replace('-', ' '))
                        if (compareDate > componentDate) {
                            this.AddTargetError(e.target, "La fecha de consulta debe ser mayor a la de ocurrencia");
                            } else {
                            this.RemoveTargetError(e.target);
                        }
                        break;
                    case "NotificationDate":
                        compareDate = new Date($(this.component).find('#IncidenceDate').val().replace('-', ' '))
                        if (compareDate > componentDate) {
                            this.AddTargetError(e.target, "La fecha de Notificación debe ser mayor a la de ocurrencia");
                            
                        } else {
                            this.RemoveTargetError(e.target);
                        }
                        break;
                }
            }
            else {
                
                this.AddTargetError(e.target, "La fecha ingresada debe ser mayor a la fecha de nacimiento y menor a la actual");
                this.IsComponentValid = false;
            }
        }
    },
    ValidateComponent: function () {
        var result = true;
        var ta = $(this.component).find('textarea[data-required="True"]');
        ta.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                this.AddTargetError($(comp), "Campo Obligatorio");
                result = false;
            }
        });

        var inp = $(this.component).find('input[data-required="True"]');
        inp.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                this.AddTargetError($(comp), "Campo Obligatorio");
                result = false;
            }
        });

        var sel = $(this.component).find('select [data-required="True"]');
        inp.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                this.AddTargetError($(comp), "Seleccione una opción");
                result = false;
            }
        });

        return result;

    }

 }