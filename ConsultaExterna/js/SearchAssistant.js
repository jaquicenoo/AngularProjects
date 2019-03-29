function SearchAsistant() {
    this.control = null;
    this.tagys = new Array();
}
SearchAsistant.prototype.init = function() {
    this.control = document.getElementById('searchassistant');

    this.control.querySelectorAll('[data-tagify]').forEach(function(tagy) {
        // iniciliza los tagofy
        var tagyControl = new Tagify(tagy, {
            whitelist: [],
            dropdown: {
                enabled: 1
            }
        });
        // add a class to Tagify's input element
        tagyControl.DOM.input.classList.add('tagify__input--outside');

        // re-place Tagify's input element outside of the  element (tagify.DOM.scope), just before it
        tagyControl.DOM.scope.parentNode.insertBefore(tagyControl.DOM.input, tagyControl.DOM.scope);

        this.tagys.push(tagyControl);
    }, this);

    // evento del filtro principal
    this.control.querySelectorAll('#filter input').forEach(function(input) {
        input.addEventListener('click', this.showSection.bind(this));
    }, this);
    // evento para el popover 
    $('.action-ico.notes').on('shown.bs.popover', function(e) {
        document.querySelectorAll('#okBtn').forEach(function(li) {
            li.addEventListener('click', this.addExplanatoryNote.bind(this));
        }, this)
    }.bind(this));
};
// realiza el switch entre una sección y otra
SearchAsistant.prototype.showSection = function(e) {
    if (e.target.id == 'sa_orme') {
        this.control.querySelector('#conOrdenes').classList.remove('hidden');
        this.control.querySelector('#conNotas').classList.add('hidden');
    } else if (e.target.id == 'sa_nocli') {
        this.control.querySelector('#conOrdenes').classList.add('hidden');
        this.control.querySelector('#conNotas').classList.remove('hidden');
    }
};
// metodo para visualizar las notas relacionadas
SearchAsistant.prototype.addExplanatoryNote = function(e) {
    var textarea = e.target.closest('.pop-signature').querySelector('textarea');
    if (!textarea.value.trim()) return;
    var template = `${textarea.value}
    <p><strong>Fimado por: </strong>jhon</p>
    <p><strong>Fecha:</strong>2018/05/06</p>
    <hr class="striped-border">`;

    var note = document.createElement('div');
    note.className = 'animated fadeIn fast cotainer-note';
    note.innerHTML = template;
    this.control.querySelector(`[name="${e.target.dataset.content}"]`).appendChild(note);
    $('#' + e.target.dataset.content).popover('hide')
};