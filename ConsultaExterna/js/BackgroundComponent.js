// clase principal de antecedentes

function BackgroundsComponent(patient) {
    this.control = null;
    this.Backgrounds = new Array();
    this.patient = patient;
    this.episode;
    this.firstSave;
    this.jsonApiBaseUrl;
    this.jsonApiCollection;
    this.lastSaved = '';
    this.saveIntervalMinutes;
    this.apiBaseGrowtPattern;
    // inicialización 
    this.init();
}

// prototipos 
// control init se crea cada antecedente y sus controles
BackgroundsComponent.prototype.init = function() {
    this.control = document.getElementById("backgroundComponent");
    //selecciona todos los antecedentes y crea su objeto
    this.control.querySelectorAll('[data-background]').forEach(function(back) {
        if (back.id === "bgpathological") {
            this.Backgrounds.push(new PathologicalBackground(back.id));
        } else {
            this.Backgrounds.push(new Background(back.id));
        }
    }, this);
}