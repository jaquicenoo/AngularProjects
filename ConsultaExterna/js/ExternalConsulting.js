// clase para consulta externa
function ExternalConsult() {
    this.header = null;
    this.reviewBySystems = null;
    this.physicalExam = null;
    this.generalInfo = null;
    this.generalInformationComponent = null;
    this.escalesComponet = null;
	this.vitalSignsComponent = null;
	this.backgroundComponent = null;
    this.patientDestination = null;
    this.recommendationsComponent = null;
    this.patientConditionsComponent = null;
    this.analisysAndManagementPlanComponent = null;
    this.externalCauseInjuriesComponent = null;
    this.diagnosticsComponent = null;
    this.signatureComponent = null;
    this.appointmentStateUrl = '';
    this.generalSaveUrl = '';

    this.externalConsultData = {
        HealtRegister: {
            Sequence: Number,
            Patient: {
                Episode: String,
                HistoryNumber: String,
                Info: String
            },

            Program: String,
            TemplateType: String,
            Specialty: String,
            EventDate: Date,
            RegisterDate: Date,
            Text: String,
            State: String
        },
        Details: Array
    };

    this.AppointmetStateData = {
        ChangeAppointmentStateData: {
            AppointmentSource: String,
            AppointmentDocument: Number,
            AppointmentStructure: String,
            AppointmentState: String,
            AppointmentObservation: String,
            AppointmentNoAttendanceCause: String,
            Episode: Number,
            AppointmentCallProcess: String,
            User: String
        }
    };

}
ExternalConsult.prototype = {
    Init: function () {
        // inicializa los componentes
        this.header = $('#HeaderPatient');
        this.generalInfo = $(".scse-generalinformation");
        this.externalConsultData.Details = new Array();
        this.externalConsultData.HealtRegister.Patient.Episode = this.header.data("episode");
        this.externalConsultData.HealtRegister.Patient.HistoryNumber = this.header.data("configuration").HistoryNumber;
        this.externalConsultData.HealtRegister.Patient.Info = this.header.data("configuration");
        this.generalSaveUrl = $('#genSaveUrlDiv').data('generalsaveurl');
        //Inicializa JSON para cambiar estado de la cita a Salida (Atendido)
        this.AppointmetStateData.ChangeAppointmentStateData.AppointmentSource = $('#appointmentSource').val();
        this.AppointmetStateData.ChangeAppointmentStateData.AppointmentDocument = $('#appointmentDocument').val();
        this.AppointmetStateData.ChangeAppointmentStateData.AppointmentStructure = $('#appointmentStructure').val();
        this.AppointmetStateData.ChangeAppointmentStateData.Episode = this.header.data("episode");
        this.AppointmetStateData.ChangeAppointmentStateData.AppointmentState = $('#appointmentState').val(); //Estado Salida (Atendido)
        this.AppointmetStateData.ChangeAppointmentStateData.User = $('#appointmentUser').val();                                                                                                                                                                                                                  
        this.appointmentStateUrl = $('#appointmentStateUrlDiv').data('appointmentStateUrl');
        
        // funciones de cargue inicial

    },
    InitComponent: function () {
        this.reviewBySystems = $("#review-by-systems");
        this.physicalExam = $("#PhysicalExam");
        $("#review-by-systems").scse_revs_n_finds();
        $("#PhysicalExam").scse_revs_n_finds();

        this.generalInformationComponent = new GeneralInformationComponent($('.scse-generalinformation'));
        this.generalInformationComponent.Init();

        //$(".scse-generalinformation").startGeneralInformationPartialSaveInterval();
        //$(".scse-PatientConditions").starPatientConditionsPartialSaveInterval();

        //this.externalCauseInjuriesComponent = new ExternalCauseInjuriesComponent($('#idExternalCauseInjuries'));
        //this.externalCauseInjuriesComponent.Init();

        //patientConditionsContainer
        this.patientConditionsComponent = new PatientConditionsComponent($('#patientConditionsContainer'));
        this.patientConditionsComponent.Init();

        $(".scse-revsnfindings").startRevisionsAndFindingsPartialSaveInterval();
        //$(".scse-analysisAndManagementPlan").startAnalysisInformationPartialSaveInterval();

        // inicializado del componente de escalas
        this.escalesComponet = new ScalesComponent();
        this.escalesComponet.Init(this.header.data("configuration"));

        // inicializado del componente de signos vitales
        //this.vitalSignsComponent = new VitalSigns(this.header.data("configuration"));
        //this.vitalSignsComponent.init();

		// inicializado del componente de antecedentes
		this.backgroundComponent = new BackgroundsComponent();

        // inicializamos el componente Destino del Paciente
        this.patientDestination = new PatientDestinationComponent();
        this.patientDestination.init();

        $(function () {
            var headers = $(".ExpandableTextArea");
            for (var i = 0; i < headers.length; i++) {
                var h = new ExpandableTextArea(headers[i]);
            }
        });

        //var headers = $(".signContainer");
        //for (var i = 0; i < headers.length; i++) {
        //    var h = new SignatureComponent(headers[i], this.ValidateConsult.bind(this));
        //}

        this.signatureComponent = new SignatureComponent($('#signingDiv'), this.ValidateConsult.bind(this));

        this.diagnosticsComponent = new DiagnosticsComponent($('#diagnosticComponentDiv'));
        this.diagnosticsComponent.Init();

        this.recommendationsComponent = new RecommendationsComponent($('#recommendationComp'));
        this.recommendationsComponent.Init();

        this.analisysAndManagementPlanComponent = new AnalysisAndManagementPlan($('#anplancam'));
        this.analisysAndManagementPlanComponent.Init();



    },
    GetDataComponent: function (component) {
        // devuelve la data a guardar por componente
        switch (component) {
            case 'sistemsTag':
                return { key: "PhysicalCheck", value: this.reviewBySystems.data("configuration") };
            case 'physicalExamTag':
                return { key: "PhysicalCheck", value: this.physicalExam.data("configuration") };
            case 'headerPatientTag':
                return { key: "", value: this.header.data("configuration") };
            case 'genInfoTag':
                var genInfoData = [];
                $.each(this.generalInfo.getGeneralInformationData(), function (index, value) {
                    genInfoData.push({ key: "Field", value: value });
                });
                return genInfoData;
            default:
        }
    },
    GetExternalConsultData: function () {
        // obtiene los daos a guardar de todos los componentes
        let genInfoData = this.GetDataComponent('genInfoTag');
        this.externalConsultData.Details.push(this.GetDataComponent('physicalExamTag'));
        this.externalConsultData.Details.push(this.GetDataComponent('sistemsTag'));
        this.externalConsultData.Details.push(genInfoData[0], genInfoData[1]);
        this.externalConsultData.Details.push(this.GetDataComponent('headerPatientTag'));

        // request con el formato de datos a guardar
        var ajax = $.ajax({
            url: "/Home/SaveExternalConsult",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(this.externalConsultData)
        });
        ajax.done(function (data) {
            console.log(data);
        });
        ajax.fail(function (error) {
            console.log(error);
        });
    },

    ValidateConsult: async function () {

        try {
            var valll = this.vitalSignsComponent.validate();
            console.log(valll);

            $('body').loadingModal({
                position: 'auto',
                text: 'Validando Componentes',
                color: '#fff',
                opacity: '0.7',
                backgroundColor: 'rgb(0,0,0)',
                animation: 'doubleBounce'
            });


            //general information
            var Okgeninfo = this.generalInformationComponent.ValidateComponent();
            console.log('genInf: ' + Okgeninfo);
            if (Okgeninfo) {
                var geninfoSaved = await this.generalInformationComponent.ComponentPartialSave();
                console.log('genInfSaved' + geninfoSaved);
            }

            //condiciones del paciente
            var Okpcc = this.patientConditionsComponent.ValidateComponent();
            console.log('cond: ' + Okpcc);
            if (Okpcc) {
                var pccSaved = await this.patientConditionsComponent.ComponentPartialSave();
                console.log('pccSaved' + pccSaved);
            }

            //revisión por sistemas
            var okRevSis = $("#review-by-systems").ValidateComponent();
            console.log('revSis: ' + okRevSis);
            if (okRevSis) {
                var revsisSaved = await $("#review-by-systems").ComponentPartialSave();
                console.log('revsisSaved: ' + revsisSaved);
            }

            //examen físico
            var okExaFis = $("#PhysicalExam").ValidateComponent();
            console.log('EXAFis: ' + okExaFis);
            if (okRevSis) {
                var exafisSaved = await $("#PhysicalExam").ComponentPartialSave();
                console.log('revsisSaved: ' + exafisSaved);
            }


            //destino del paciente
            var OkpatDest = this.patientDestination.validate();
            console.log('desPac: ' + OkpatDest);
            if (OkpatDest) {
                var patDestSaved = await this.patientDestination.ComponentPartialSave();
                console.log('destPacSaved' + patDestSaved);
            }

            //análisis y plan de manejo
            var Okpanplan = this.analisysAndManagementPlanComponent.ValidateComponent();
            console.log('anplan: ' + Okpanplan);
            if (Okpanplan) {
                var anplanSaved = await this.analisysAndManagementPlanComponent.ComponentPartialSave();
                console.log('anpanSaved' + anplanSaved);
            }

            //recomendaciones
            if ($('#recommendationComp-Recbody').hasClass('show')) {
                var Okrec = this.recommendationsComponent.ValidateComponent();
                console.log('rec: ' + Okrec);
                if (Okrec) {
                    var recSaved = await this.recommendationsComponent.ComponentPartialSave();
                    console.log('recSaved' + recSaved);
                }
            }
            else {
                Okrec = true;
            }

            //LesionesCausaExterna
            if ($("#idExternalCauseInjuries").length > 0) {
                var Okles = this.externalCauseInjuriesComponent.ValidateComponent();
                console.log('les: ' + Okles);
                if (Okles) {
                    var lesSaved = await this.externalCauseInjuriesComponent.ComponentPartialSave();
                    console.log('lesSaved' + lesSaved);
                }
            }
            else {
                Okles = true;
            }

            console.log('Resultado Validación: ' + Okgeninfo && Okpcc && OkpatDest && Okrec && Okpanplan && okRevSis && okExaFis && Okles);

            if (Okgeninfo && Okpcc && OkpatDest && Okrec && Okpanplan && okRevSis && okExaFis && Okles) {

                //validate password
                //var r = true;
                $('body').loadingModal('text', 'Validando firma de usuario');
                var r = true;

                r = await $.ajax({
                    suppressGlobalErrorHandler: true,
                    url: '/Authentication/ValidateUser/' + '?pass=' + this.signatureComponent.password,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json'
                }).done(function (data) {
                    return data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 500) {
                        return false;
                    }
                    console.log(textStatus + ': ' + errorThrown);
                    return false;
                });


                if (r) {
                    $('body').loadingModal('text', 'Guardando consulta');
                    var fff = this.generalSaveUrl + + this.externalConsultData.HealtRegister.Patient.Episode + '/' + this.externalConsultData.HealtRegister.Patient.HistoryNumber;
                    var rr = await $.ajax({
                        url: this.generalSaveUrl + this.externalConsultData.HealtRegister.Patient.Episode + '/' + this.externalConsultData.HealtRegister.Patient.HistoryNumber,
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (d) {
                            return d;
                        },
                        error: function (err) {
                            console.log("ERROR codigo( " + err.status + "): " + err.responseText);
                            $('#mymodalEC').modal('show');
                            return false;
                        }
                    });

                    if (rr) {
                        //alert('Guardo Completo');
                        $('body').loadingModal('hide');
                        $('body').loadingModal('destroy');
                        $('#mymodalEC').modal({ backdrop: 'static', show: true });
                        $('#mymodalEC').find('#exampleModalLabel').text('Información');
                        $('#mymodalEC').find('#mymodalECBody').html('Proceso finalizado con éxito.');
                        $('#mymodalEC').find('#mymodalECFooter').html('<button type="button" class="btn btnmodal-success" data-dismiss="modal"  onClick="iraHome();">Aceptar</button>');

                        //window.location.href = '/Home/';
                    }
                    else {
                        $('body').loadingModal('hide');
                        $('body').loadingModal('destroy');
                        $('#mymodalEC').modal('show');
                        $('#mymodalEC').find('#exampleModalLabel').text('Error');
                        $('#mymodalEC').find('#mymodalECBody').html('Se presentaron errores en el proceso de grabación.');
                        //alert('Errores guardando');
                    }
                }
                else {
                    $('body').loadingModal('hide');
                    $('body').loadingModal('destroy');
                    $('#mymodalEC').modal('show');
                    $('#mymodalEC').find('#exampleModalLabel').text('Error');
                    $('#mymodalEC').find('#mymodalECBody').html('No fue posible validar su contraseña. Intente Nuevamente');
                }

            }
            else {
                $('body').loadingModal('hide');
                $('body').loadingModal('destroy');
                $('#mymodalEC').modal('show');
                $('#mymodalEC').find('#exampleModalLabel').text('Error');
                $('#mymodalEC').find('#mymodalECBody').html('Se presentaron errores de validación. Verifique los datos ingresados.');
            }

        }
        catch(error){
            console.log(error);
            $('#mymodalEC').find('#exampleModalLabel').text('Error');
            $('#mymodalEC').find('#mymodalECBody').html('Se presentaron errores durante el proceso.');
        }
        finally {
            $('body').loadingModal('hide');
            $('body').loadingModal('destroy');
            $('#mymodalEC').modal('show');
            
        }
    }
};

function iraHome() {
    window.location.href = "/Home/";
}