var fix = true;

$(function () {
    var headers = $(".patient-header-card3");
    for (var i = 0; i < headers.length; i++) {
        var h = new HeaderPatient(headers[i]);
    }

});

function HeaderPatient(container) {
    var that = this; //Singleton
    this.Container = container;
    this.Collapsed = true;
    var h = $(this.Container).scrollParent()[0];
    var b = $(this.Container).find("#bubble");
    var p = $(this.Container).find("#pin");
    $(h).scroll(function () {
        if ($(h).scrollTop() > 120 && fix) {
            this.Fix(true);
        } else {
            this.Fix(false);
        }
    }.bind(this));

    $(p).click(function () {
        this.PinClick();
    }.bind(this));

    $(b).click(function () {
        this.PinClick();
    }.bind(this));
}
HeaderPatient.prototype = {
    Fix: function (fixed) {
        if (fixed) {
            $(this.Container).addClass("fixed", 1);
            $("#stepper").addClass("sticky-top");
            $("#stepper").addClass("sticky-offset");
            //$("#stepper").css("margin-left", "38px");
            //$("#stepper").css("top", "25px");
        } else {
            $(this.Container).removeClass("fixed", 1);
            $("#stepper").removeClass("sticky-offset");
            $("#stepper").removeClass("sticky-top");
            //$("#stepper").css("margin-left", "");
            //$("#stepper").css("top", "");
        }
    },

    PinClick: function () {
        fix = !fix;
        $(this.Container).removeClass("fixed", 1);
        $("#stepper").removeClass("sticky-offset");
        $("#stepper").removeClass("sticky-top");
        //$("#stepper").css("margin-left", "");
    }
}

function pp() {
    $("#hCam").toggleClass("sticky-top");
    alert('ff');
}
function f() {
    //$("#perro").removeClass("fixed");
    //alert('img click');
    fix = !fix;
}

