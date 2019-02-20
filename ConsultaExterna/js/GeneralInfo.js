function GeneralInformationComponent(container) {
    this.component = container;
    this.episode;
    this.firstSave;
    this.jsonApiUrl;
    this.jsonApiCollection;
    this.lastSaved;
    this.saveIntervalMinutes;
    this.bcItemId;
    
    $(this.component).find('textarea[data-required="True"]').blur(function (e) {
        this.ValidateTextArea(e);
    }.bind(this));

    this.component.click(function () {
        this.ValidateRadios();
    }.bind(this));
}

GeneralInformationComponent.prototype = {
    Init: function () {
        //$("#idExternalCause").chosen({
        //    disable_search_threshold: 10,
        //    no_results_text: "no se encontro resultado"
        //});
        //$("#idPurpouse").chosen({
        //    disable_search_threshold: 10,
        //    no_results_text: "no se encontro resultado"
        //});

        this.episode = this.component.data('episode');
        this.firstSave = this.component.data('firstSave');
        this.jsonApiUrl = this.component.data('apiBaseUrl');
        this.jsonApiCollection = this.component.data('collectionName');
        this.lastSaved = JSON.stringify(this.component.data("lastsaved"));
        this.saveIntervalMinutes = this.component.data('saveIntervalMinutes');
        this.bcItemId = this.component.data('bcitemid');

        this.startPartialSaveInterval();
    },
    startPartialSaveInterval: function () {
        let thisObj = this;
        setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 60000);
    },
    ComponentPartialSave: async function () {
        var jsonData = {
            appointmentType: this.component.find(":radio[name='appointmentType']:checked").val() === undefined ? "" : this.component.find(":radio[name='appointmentType']:checked").val(),
            AppointmentTypeText: this.component.find(":radio[name='appointmentType']:checked").data('description'),
            purpouse: this.component.find("#idPurpouse").val(),
            PurposeText: this.component.find("#idPurpouse option:selected").text(),
            reason: this.component.find("#reason").val(),
            cIllness: this.component.find("#cillness").val(),
            externalCause: this.component.find('#idExternalCause').val(),
            ExternalCauseText: this.component.find('#idExternalCause  option:selected').text(),
        };

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

            var result = await SendPartialSavedData2($jsonObj, method, 'text');
            if (result) {
                this.component.data("lastsaved", $jsonObj);
                this.component.data('firstSave', false);
                this.firstSave = false;
            }

            return result;
        }
    },
    ValidateTextArea: function (e) {
        if ($(e.target).val().length === 0) {
            $("#" + this.bcItemId).addClass('bcError');
            $(e.target).addClass('IsWrong');
            ShowMyError(e.target, 'Campo Obligatorio');
        }
        else {
            $(e.target).removeClass('IsWrong');
            $(e.target).tooltip('dispose');
            if (this.component.find('.IsWrong').length === 0)
                $("#" + this.bcItemId).removeClass('bcError');
            
        }
    },
    ValidateRadios: function () {
        var ck = this.component.find(":radio[name='appointmentType']:checked");
        if (ck.length < 1) {
            $("#" + this.bcItemId).addClass('bcError');
            $(this.component.find('#generalinfo-appointmenttypecontainer')).addClass('IsWrong');
            ShowMyError($(this.component.find('#generalinfo-appointmenttypecontainer')), 'Debe seleccionar una opción');
            result = false;
        }
        else {
            $(this.component.find('#generalinfo-appointmenttypecontainer')).removeClass('IsWrong');
            $(this.component.find('#generalinfo-appointmenttypecontainer')).tooltip('dispose');
        }
    },

    ValidateComponent: function () {
        var result = true;

        if (this.component.find("#idPurpouse").val().length === 0) {
            result = false;
            $(this.component.find("#idPurpouseContainer")).addClass('IsWrong');
            ShowMyError($(this.component.find("#idPurpouseContainer")), "Seleccione una opción");
        }
        else {
            $(this.component.find("#idPurpouseContainer")).tooltip('dispose');
            $(this.component.find("#idPurpouseContainer")).removeClass('IsWrong');
        }

        if (this.component.find('#idExternalCause').val().length === 0) {
            result = false;
            $(this.component.find("#idExternalCauseContainer")).addClass('IsWrong');
            ShowMyError($(this.component.find("#idExternalCauseContainer")), "Seleccione una opción");
        }
        else {
            $(this.component.find('#idExternalCauseContainer')).tooltip('dispose');
            $(this.component.find("#idExternalCauseContainer")).removeClass('IsWrong');
        }

        var ck = this.component.find(":radio[name='appointmentType']:checked");
        if (ck.length < 1) {
            $(this.component.find('#generalinfo-appointmenttypecontainer')).addClass('IsWrong');
            ShowMyError($(this.component.find('#generalinfo-appointmenttypecontainer')), 'Debe seleccionar una opción');
            result = false;
        }
        else {
            $(this.component.find('#generalinfo-appointmenttypecontainer')).removeClass('IsWrong');
            $(this.component.find('#generalinfo-appointmenttypecontainer')).tooltip('dispose');
        }

        var ta = $(this.component).find('textarea[data-required="true"]');
        ta.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                $(comp).addClass('IsWrong');
                ShowMyError($(comp), 'Campo obligatorio');
                result = false;
            }
        });

        if (result)
            $("#" + this.bcItemId).removeClass('bcError');
        else
            $("#" + this.bcItemId).addClass('bcError');

        return result;
    }
}