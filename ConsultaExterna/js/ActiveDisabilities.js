var _disabilities = []
    // datos de prueba esto es lo que retornara el servicio
var disabilitiesample = {
    AdministrativeStructureCode: '',
    AdministrativeStructureName: 'Cede principal',
    CauseOfDisability: '',
    Episode: 234578,
    ConsecutiveDisability: 11320,
    DaysOfDisability: 10,
    InitialDisabilityDate: '01/02/2019',
    FinalDisabilityDate: '10/02/2019',
    DiagnosticCode: 'R124',
    DiagnosticName: 'Cefalea',
    StateCode: 'Re12',
    NameState: 'Urgente'
};

function GetDisabilities() {
    // esta tabla se toma al mostrar el popover
    var tbody = document.querySelector('.tbhistoric tbody');
    // se agregan las incapacidades a la tabla
    for (let disable of _disabilities) {
        var row = document.createElement("tr");
        row.innerHTML =
            `<td>${disable.AdministrativeStructureName}</td>
        <td>${disable.Episode}</td>
        <td>${disable.ConsecutiveDisability}</td>
        <td>${disable.DaysOfDisability}</td>
        <td>${disable.DiagnosticCode}-${disable.DiagnosticName}</td>
        <td>${disable.InitialDisabilityDate}</td>
        <td>${disable.InitialDisabilityDate}</td>
        <td>Ambulatorio</td>
        <td>${disable.StateCode}</td>`;
        tbody.appendChild(row);
    }
}

function DisabilitiesMessages() {
    // se crea la tabla y se inicializa el popover
    $.each($('.action-ico.historic'), function(key, value) {
        $(value).popover({
            html: true,
            content: function() {
                return ` 
                <div class="row tbhistoric-container">
                <div class="col-sm-12 pl-4">
                    <label>Incapacidades del paciente</label>
                </div>
                <div class="col-sm-12">
                    <div class=" tb-back">
                        <table class="tbhistoric">
                            <thead>
                                <tr>
                                    <th>Centro de atención</th>
                                    <th>Episodio</th>
                                    <th>Consecutivo</th>
                                    <th>Días</th>
                                    <th>Diagnostico</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha fin</th>
                                    <th>Tipo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
            }
        });
    });
    // cuando el popover se muestra le pasa los rows 
    $('.action-ico.historic').on('shown.bs.popover', function(e) {
        this.GetDisabilities();
        $('.action-ico.historic').popover('update');
    }.bind(this));
    // esto se remplaza por el fetch
    _disabilities.push(disabilitiesample);
}