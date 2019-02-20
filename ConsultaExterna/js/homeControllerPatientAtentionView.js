$(document).ready(function () {
    $('#data-scroll').find("#cargarHeaderPatientBtn").click();
});

function initLoadingModal(container,innerText) {
    $(container).loadingModal({
        position: 'auto',
        text: innerText,
        color: '#fff',
        opacity: '0.7',
        backgroundColor: 'rgb(0,0,0)',
        animation: 'doubleBounce'
    });
}
function destroyLoadingModal(container) {
    $(container).loadingModal('hide');
    $(container).loadingModal('destroy');
}
function onBegin() {
    initLoadingModal('body','Cargando datos del Paciente')
}
function onFailed(xhr, httpStatusMessage, customErrorMessage) {
    if (xhr.status == 404) {
        alert(`Error 404 Page Not found,  No se encuentra la pagina que busca`);
        window.history.back();
    }
}
function onSuccess(context) {
    $('.jquery-loading-modal__text')[0].textContent = "Cargando componentes de la consulta"
    HeaderPatienComplete();
}
function HeaderPatienComplete() {
  
    ExternConsult = new ExternalConsult();
    ExternConsult.Init();
    $('#patientGender').val(ExternConsult.externalConsultData.HealtRegister.Patient.Info.GenreCode);
    $('#patientAgeDecimal').val(ExternConsult.externalConsultData.HealtRegister.Patient.Info.AgeDecimal.toString());
    $('#data-scroll').find("#cargarComponentesBtn").click();
  }
function ComponentsComplete() {
    ExternConsult.InitComponent();
    destroyLoadingModal('body');
    $('.scalesCollapsible').bind('click', function () {
        if ($('.scalesContent').css('display') == "block") {
            $('.scalesContent').css('display', "none");
            $('.scalesCollapsible')[0].value = 'Mostrar escalas';
        }
        else {
            $('.scalesContent').css('display', "block");
            $('.scalesCollapsible')[0].value = 'Ocultar escalas';
        }
    });
    $('#idExternalCause').change(function () {
        loadFormExternalCause();
    });
    loadFormExternalCause(ExternConsult.externalConsultData.HealtRegister.Patient.Episode);

    

}
function loadFormExternalCause(episode) {
    var typeForm = $('#idExternalCause').children("option:selected").attr("data-relatedform");
    var code = $('#idExternalCause').children("option:selected")[0].value;

    if ($('#idExternalCauseInjuries').length > 0) {
        var ta = $('#idExternalCauseInjuries').find('[data-required="true"]');
        ta.each(function (index, comp) {
            $(comp).tooltip('dispose');
        });
    }
    if (typeForm != "" && typeForm != null) {
        //initLoadingModal('body', 'Cargando formulario')
        createLoader('externalCauseForm');
        $.post(`/Home/GetExternalCauseForm?episode=${episode}&relatedForm=${typeForm}&code=${code}`, function (data) {
            //destroyLoadingModal('body');
            $('#externalCauseForm').html(data)
            
            ExternConsult.externalCauseInjuriesComponent = new ExternalCauseInjuriesComponent($('#idExternalCauseInjuries'));
            ExternConsult.externalCauseInjuriesComponent.Init();
        });
    }
    else {
        $('#externalCauseForm').html("")
    }
}
function createLoader(contenedor) {
    var loader = "<div id='loader' align='center' class='loader'> <img src='../images/loading.gif' width='32px' height='32px' ><br>Cargando...</div >"
    $(`#${contenedor}`).html(loader);
}


// ofset al scrollspy para que ajuste con el contenido 
$('#section-picker li a').click(function (event) {
	event.preventDefault();
	let offset = -220;
	if ($('#hCam').hasClass('show')) {
		offset = -180;
	}
	$($(this).attr('href'))[0].scrollIntoView();
	scrollBy(0, offset);
});