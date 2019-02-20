function PatientConditionsComponent(container) {
    this.component = container;
    this.episode;
    this.firstSave;
    this.jsonApiUrl;
    this.jsonApiCollection;
    this.lastSaved;
    this.saveIntervalMinutes;
    this.bcItemId;
    this.IsRequired;
    

    this.component.click(function () {
        this.ValidateComponent();
    }.bind(this));
}

PatientConditionsComponent.prototype = {
    Init: function () {

        this.episode = this.component.data('episode');
        this.firstSave = this.component.data('firstSave');
        this.jsonApiUrl = this.component.data('apiBaseUrl');
        this.jsonApiCollection = this.component.data('collectionName');
        this.lastSaved = JSON.stringify(this.component.data("lastsaved"));
        this.saveIntervalMinutes = this.component.data('saveIntervalMinutes');
        this.bcItemId = this.component.data('bcitemid');
        this.IsRequired = this.component.data('required') !== undefined ? this.component.data('required').toLowerCase() === 'true' ? true : false : false;

        this.startPartialSaveInterval();
    },
    startPartialSaveInterval: function () {
        let thisObj = this;
        setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 60000);
    },
    ComponentPartialSave: async function () {

        var causes = [];

        //this.component.find(":checkbox[name='cause']:checked").each(function () {
        //    causes.push($(this).attr('value'));
        //});
        this.component.find(":checkbox[name='cause']").each(function () {
            var value = 'N';
            var check = $(this).is(':checked');
            if (check) {
                value = 'S';
            }
            causes.push({ Code: $(this).attr('value'), Description: $(this).data('description'), Value: value, Type: 'L', AdditionalInfo: "CONPAC", Genre: $(this).data('genre'), Indicator: $(this).data('indicator'), Latest: $(this).data('latest'), Select: check });
        });

        var jsonData = causes;

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
    ValidateComponent: function () {
        if (!this.IsRequired)
            return true;

        var ck = this.component.find(":checkbox[name='cause']:checked");
        if (ck.length < 1) {
            this.component.find('.myCont').addClass('IsWrong');
            ShowMyError(this.component.find('.myCont'), 'Debe Seleccionar mínimo una opción');
            $("#" + this.bcItemId).addClass('bcError');
            return false;
        }
        else {
            this.component.find('.myCont').tooltip('dispose');
            this.component.find('.myCont').removeClass('IsWrong');

            //check parent errors
            var container = this.component.closest(`[data-bcitemid=${this.bcItemId}][data-isparentcontainer="true"]`);
            if (container) {
                var errors = $(container).find('.IsWrong');
                if (errors.length === 0)
                    $("#" + this.bcItemId).removeClass('bcError');
            }                        
        }

        return true;
    }
}