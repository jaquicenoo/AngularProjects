function SignatureComponent(container, fn) {
    this.component = container;
    this.defaultImg = $(this.component).data('imgurl');
    this.clickedImg = $(this.component).data('clickimgurl');
    this.password = '';

   // this.fnn = fn;
    this.SendData = fn;
    $(this.component).find('.expander').click(function (e) {
        this.Toggle(e);
    }.bind(this));

    $(this.component).find('#clearBtn').click(function (e) {
        this.Clear(e);
    }.bind(this));

    $(this.component).find('#okBtn').click(function (e) {
        if ($(this.component.find('#signInput')).val().length === 0) {
            ShowMyError($(this.component.find('#signInput')), 'Ingrese su contraseña');
            return;
        }
        else {
            $(this.component.find('#signInput')).tooltip('dispose');
        }
        this.password = $(this.component).find('#signInput').val();
        this.SendData();
    }.bind(this));
}

SignatureComponent.prototype = {
    Init: function () {

    },
    Toggle: function (e) {
        var c = $(this.component);

        $(e.target).toggleClass('circleButtonBackColor');

        if (!$(e.target).hasClass("circleButtonBackColor")) {
            $(e.target).attr("src", this.defaultImg);
        }
        else {
            $(e.target).attr("src", this.clickedImg);
        }        
        
        var div = c.find('.hero');
        if ($(div).css('visibility') === 'hidden') {
            $(div).css('visibility', 'visible', 1000, "easeOutSine");
        }
        else {
            $(div).css('visibility', 'hidden', 1000, "easeOutSine");
        }
    },
    Clear: function (btn) {
        var c = $(this.component);
        c.find('#signInput').val('');
    },
    //SendData: function (btn) {
    //    this.fnn;
    //}
}

$(function () {
    var headers = $(".signContainer");
    for (var i = 0; i < headers.length; i++) {
        var h = new SignatureComponent(headers[i]);
    }

});