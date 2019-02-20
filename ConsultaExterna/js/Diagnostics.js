function DiagnosticsComponent(container) {
    this.component = container;
    this.episode;
    this.firstSave;
    this.jsonApiCollection;
    this.lastSaved;
    this.saveIntervalMinutes;
    this.IsComponentValid = false;
    this.bcItemId;
    this.templateContainer;

    this.historicData = [];
    this.diagnostics = [];


    $(this.component).find('#diagnosticsAddbtn').click(function () {
        this.AddNewDiagnostic();
    }.bind(this));

    $(this.component).find('.diagnosticDeleteBtn').click(function (e) {
        this.DeleteDiagnostic(e);
    }.bind(this));

    
}

DiagnosticsComponent.prototype = {
    Init: function () {

        //this.episode = this.component.data('episode');
        //this.firstSave = this.component.data('firstSave');
        //this.jsonApiCollection = this.component.data('collectionName');
        //this.lastSaved = JSON.stringify(this.component.data("lastsaved"));
        //this.saveIntervalMinutes = this.component.data('saveIntervalMinutes');
        //this.bcItemId = this.component.data('bcitemid');


        this.templateContainer = $(this.component).find('#diagnosticInfoContainer');
        this.LoadHistoric();
        this.startPartialSaveInterval();
    },

    LoadHistoric: function () {
        this.historicData = [
            {
                code: '1',
                source: 'Primario',
                date: '17/02/2019',
                age: '21',
                diagnostic: 'El diagnóstico',
                state: 'activo',
                etiology: 'N/A',
                displayJustification: 'hideJustification',
                justification: '',
                selected: false
            },
            {
                code: '2',
                source: 'Primario',
                date: '18/02/2019',
                age: '24',
                diagnostic: 'El diagnóstico',
                state: 'activo',
                etiology: 'N/A',
                displayJustification: 'hideJustification',
                justification: '',
                selected: false
            },
        ];

        var templateHistoricContainer = $(this.component).find('#diagnosticInfoContainerHistoric');
        var itemTplH = $('script[data-template="DiagnosticinfoHistoric"]').text().split(/\$\{(.+?)\}/g);
        templateHistoricContainer.append(this.historicData.map(function (item) {
            templateHistoricContainer.append('<div style="height: 5px;"></div>');
            return itemTplH.map(render(item)).join('');
        }));

        templateHistoricContainer.append('<div style="height: 5px;"></div>');


        //$(this.component).find('.btnHistoricAdd').click(function (e) {
        //    this.ShowSelectedHistoric(e);
        //}.bind(this));

        

    },

    AddNewDiagnostic: function () {
        
        this.templateContainer.show();
        var itemTpl = $('script[data-template="Diagnosticinfo"]').text().split(/\$\{(.+?)\}/g);

        

        var newObj = [{
            code: '123',
            source: 'Primario',
            date: '18/02/2019',
            age: '24',
            diagnostic: 'El diagnóstico',
            state: 'activo',
            etiology: 'N/A',
            displayJustification: 'hideJustification',
            justification: ''
        }];
        
        this.templateContainer.append(newObj.map(function (item) {
            return itemTpl.map(render(item)).join('');
        }));
        
        $(this.component).find('.diagnosticDeleteBtn').click(function (e) {
            this.DeleteDiagnostic(e);
        }.bind(this));
    },

    DeleteDiagnostic: function (e) {
        var diagContainer = $(e.target).closest('.cardContainer');
        diagContainer.remove();
    },

    startPartialSaveInterval: function () {
        let thisObj = this;
        setInterval(function () { thisObj.ComponentPartialSave(); }, thisObj.saveIntervalMinutes * 60000);
    },
    ComponentPartialSave: async function () {
    },
    ValidateComponent: function () {
    }
}

function render(props) {
    return function (tok, i) { return (i % 2) ? props[tok] : tok; };
}
