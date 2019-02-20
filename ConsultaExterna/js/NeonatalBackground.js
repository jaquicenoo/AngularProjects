function NeonatalBackgroundComponent(container) {
    this.component = container;
    this.episode;
    this.firstSave;
    this.jsonApiUrl;
    this.jsonApiCollection;
    this.lastSaved;
    this.saveIntervalMinutes;
    this.IsComponentValid = false;
    this.bcItemId;

    $(this.component).find('.switch').change(function (e) {
        this.SwitchChanged(e);
    }.bind(this));

    $(this.component).find('input[type=radio][name=PatientBirthCondition]').change(function (e) {
        this.CheckChanged(e);
    }.bind(this));

    $(this.component).find('textarea[data-required="true"]').blur(function (e) {
        this.Validate(e);
    }.bind(this));

    $(this.component).find('input[data-required="true"]').blur(function (e) {
        this.Validate(e);
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

        var header = $('#idNeonatalBackground').find(".ExpandableTextArea");
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
            PatientBirthCondition: this.component.find('#neonatalBackground-PatientBirthCondition input:radio:checked').val(),
            HasBreathDificulties: this.component.find('#neonatalBackground-HasBreathDificulties input:checkbox').is(':checked'),
            Ictericia: this.component.find('#neonatalBackground-Ictericia input:checkbox').is(':checked'),
            Hipoglicemy: this.component.find('#neonatalBackground-Hipoglicemy input:checkbox').is(':checked'),
            Seizures: this.component.find('#neonatalBackground-Seizures input:checkbox').is(':checked'),
            Cyanosis: this.component.find('#neonatalBackground-Cyanosis input:checkbox').is(':checked'),
            Incubator: this.component.find('#neonatalBackground-Incubator input:checkbox').is(':checked'),
            TimeInIncubator: this.component.find('#neonatalBackground-TimeInIncubator input').val(),
            HospitalizationRequired: this.component.find('#neonatalBackground-HospitalizationRequired input:checkbox').is(':checked'),
            HospitalizedTime: this.component.find('#neonatalBackground-HospitalizedTime input:checkbox').is(':checked'),
            Observations: this.component.find('#neonatalBackground-Observations input').val(),
            ReceivedMechanicalVentilation: this.component.find('#neonatalBackground-ReceivedMechanicalVentilation input:checkbox').is(':checked'),
            MechanicalVentilationType: this.component.find('#neonatalBackground-MechanicalVentilationType input:radio:checked').val(),
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
            this.AddTargetError(e.target, "Campo Obligatorio");
        }
        else {
            this.RemoveTargetError(e.target)
        }
    },
    AddTargetError: function (target, msg) {
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
        var ta = $(this.component).find('textarea[data-required="true"]');
        ta.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                this.AddTargetError($(comp), "Campo Obligatorio");
                result = false;
            }
        });

        var inp = $(this.component).find('input[data-required="true"]');
        inp.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                this.AddTargetError($(comp), "Campo Obligatorio");
                result = false;
            }
        });

        var sel = $(this.component).find('select [data-required="true"]');
        inp.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                this.AddTargetError($(comp), "Seleccione una opción");
                result = false;
            }
        });

        return result;

    },
    CheckChanged: function (e) {
        switch (this.name) {
            case "PatientBirthCondition":
                if (this.value == 'Sick') {
                    this.component.find("[data-dependency=Sick]").show();
                }
                else if (this.value == 'Healthy') {
                    this.component.find("[data-dependency=Sick]").hide();
                }
                break;
            case "MechanicalVentilationType":
                if (this.value == 'Other') {
                    this.component.find("[data-dependency=Other]").show();
                }
                else{
                    this.component.find("[data-dependency=Other]").hide();
                }
                break;
        }
          
    },
    SwitchChanged: function (e) {
        switch (this.id) {
            case "Incubator":
                if (this.checked) {
                   this.component.find("[data-dependency=Incubator]").show();
                }
                else {
                    this.component.find("[data-dependency=Incubator]").hide();
                }
                break;
            case "HospitalizationRequired":
                if (this.checked) {
                    this.component.find("[data-dependency=HospitalizationRequired]").show();
                }
                else {
                    this.component.find("[data-dependency=HospitalizationRequired]").hide();
                }
                break;
            case "ReceivedMechanicalVentilation":
                if (this.checked) {
                    this.component.find("[data-dependency=ReceivedMechanicalVentilation]").show();
                }
                else {
                    this.component.find("[data-dependency=ReceivedMechanicalVentilation]").hide();
                }
                break;
        }
    }

    }

