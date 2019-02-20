function AnalysisAndManagementPlan(container) {
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
}

AnalysisAndManagementPlan.prototype = {
	Init: function () {
		this.episode = this.component.data('episode');
		this.firstSave = this.component.data('firstSave');
		this.jsonApiUrl = this.component.data('apiBaseUrl');
		this.jsonApiCollection = this.component.data('collectionName');
		this.lastSaved = JSON.stringify(this.component.data("lastsaved"));
        this.saveIntervalMinutes = this.component.data('saveIntervalMinutes');
        this.bcItemId = this.component.data('bcitemid');
		this.startAnalysisInformationPartialSaveInterval();
	},
    startAnalysisInformationPartialSaveInterval: function () {
        let thisObj = this;
        setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 60000);
    },
    ComponentPartialSave: async function () {

        var jsonData = {
            CaseAnalysis: this.component.find("#caseAnalysis").val(),
            ManagementPlan: this.component.find("#managementPlan").val(),
            savedDate: new Date()
        };

        $jsonObj = {
            Episode: this.episode,
            Section: this.jsonApiCollection,
            JsonData: JSON.stringify(jsonData)
        };


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
    Validate: function (e) {
        if ($(e.target).val().length === 0) {            
            $(e.target).addClass('IsWrong');
            ShowMyError($(e.target), 'Este Campo es obligatorio');
            $("#" + this.bcItemId).addClass('bcError');
            this.IsComponentValid = false;
        }
        else {
            $(e.target).removeClass('IsWrong');            
            $(e.target).tooltip('dispose');
            if (this.component.find('.IsWrong').length === 0)
                $("#" + this.bcItemId).removeClass('bcError');
        }
    },

    ValidateComponent: function () {
        var result = true;
        var comps = $(this.component).find('textarea[data-required="true"]').not('#recommendationComp-Recbody textarea[data-required="true"]');
        comps.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                $(comp).addClass('IsWrong');
                ShowMyError($(comp), "Campo Obligatorio");                
                result = result && false;
            }
            else {
                $(comp).tooltip('dispose');
                result = result && true;
            }
        });

        if (result)
            $("#" + this.bcItemId).removeClass('bcError');
        else
            $("#" + this.bcItemId).addClass('bcError');

        return result;
    }
}

