function RecommendationsComponent(container) {
    this.component = container;
    this.episode;
    this.firstSave;
    this.jsonApiUrl;
    this.jsonApiCollection;
    this.lastSaved;
    this.saveIntervalMinutes;
    this.IsComponentValid = false;
    this.bcItemId;

    $(this.component).find('#recommendationComp-days').blur(function (e) {
        this.CalculateNextDate(e);
    }.bind(this));

    $(this.component).find('.switch').change(function (e) {
        this.SwitchChanged(e);
    }.bind(this));

    $(this.component).find('textarea[data-required="True"]').blur(function (e) {
        this.Validate(e);
    }.bind(this));

    $(this.component).find('input[data-required="True"]').blur(function (e) {
        this.Validate(e);
    }.bind(this));

    $(this.component).find('#recommendationComp-days').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    //$(this.component).find('#recommendationComp-days').change(function (e) {
    //    if (this.value === '')
    //        this.val('1');
    //    this.CalculateNextDate(e);
    //}.bind(this));

}

RecommendationsComponent.prototype = {
    Init: function () {

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
        var $jsonObj = null;
        var active = this.component.find('#recommendationComp-hasRec').is(":checked");        

        if (JSON.stringify($jsonObj) !== this.lastsaved) {

            var days = parseInt(this.component.find('#recommendationComp-days').val());
            if (!$.isNumeric(days)) {
                days = 0;
            }

            var datestr = this.component.find('#recommendationComp-nextDate').val().split('/');
            
            var jsonData = {
                IsActive: active,
                               
                DaysToNextDate: days,
                NextDate: datestr.length === 3 ? new Date(datestr[1] + ' ' + datestr[0] + ' ' + datestr[2]) : new Date(),

                HasDietRecommendatios: this.component.find('input.switch#recommendationComp-recDieta').is(':checked'),
                DietRecommendations: this.component.find('#recommendationComp-recDietaChild').val(),

                HasPhysicalRecommendations: this.component.find('input.switch#recommendationComp-recActFis').is(':checked'),
                PhysicalRecommendations: this.component.find('#recommendationComp-recActFisChild').val(),

                HasInHouseOxygen: this.component.find('input.switch#recommendationComp-reqOxiDom').is(':checked'),
                InHouseOxygen: this.component.find('#recommendationComp-reqOxiDomChild').val(),

                HasQuirurgicalCares: this.component.find('input.switch#recommendationComp-recCurCir').is(':checked'),
                QuirurgicalCares: this.component.find('#recommendationComp-recCurCirChild').val(),

                AlarmSigns: this.component.find('#recommendationComp-alarmSigns').val(),
                OtherRecommendations: this.component.find('#recommendationComp-otherRec').val(),
                //Questions: questions
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
        }
    },
    SwitchChanged: function (e) {
        var isEnabled = $(e.target).is(":checked");
        var child = this.component.find('#' + $(e.target).attr('id') + 'Child');
        child.data('required', isEnabled);
        child.prop('disabled', !isEnabled);
        child.attr('data-required', isEnabled);
        child.tooltip('dispose');
        child.val('');

        if (child.hasClass('IsWrong')) {
            child.removeClass('IsWrong');
            var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
            if (container) {
                var errors = $(container).find('.IsWrong');
                if (errors.length === 0)
                    $("#" + this.bcItemId).removeClass('bcError');
            }
        }

        $(this.component).find('input[data-required="True"]').blur(function (e) {
            this.Validate(e);
        }.bind(this));

    },
    CalculateNextDate: function (e) {
        var date = new Date();
        var days = parseInt($(e.target).val());
        if (!$.isNumeric(days)) {
            days = 0;
        }
        date.setDate(date.getDate() + days);
        this.component.find('#recommendationComp-nextDate').val(date.toLocaleDateString());
    },
    Validate: function (e) {
        if ($(e.target).val().length === 0) {
            $(e.target).addClass('IsWrong');
            $("#" + this.bcItemId).addClass('bcError');
            ShowMyError($(e.target), "Campo Obligatorio");
            this.IsComponentValid = false;
        }
        else {
            $(e.target).tooltip('dispose');
            $(e.target).removeClass('IsWrong');
            //check parent errors
            var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
            if (container) {
                var errors = $(container).find('.IsWrong');
                if (errors.length === 0)
                    $("#" + this.bcItemId).removeClass('bcError');
            }
        }
    },

    ValidateComponent: function () {
        var result = true;

        var ta = $(this.component).find('textarea[data-required="True"]');
        ta.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                $(comp).addClass('IsWrong');
                ShowMyError($(comp), "Campo Obligatorio");
                result = false;
            }
        });

        var inp = $(this.component).find('input[data-required="True"]');
        inp.each(function (index, comp) {
            if ($(comp).val().length === 0) {
                $(comp).addClass('IsWrong');
                ShowMyError($(comp), "Campo Obligatorio");
                result = false;
            }
        });

        if (result) {
            var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
            if (container) {
                var errors = $(container).find('.IsWrong');
                if (errors.length === 0)
                    $("#" + this.bcItemId).removeClass('bcError');
            }
        }
        else {
            $("#" + this.bcItemId).addClass('bcError');
        }

        return result;
    }
}