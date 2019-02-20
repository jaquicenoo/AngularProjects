function ExpandableTextArea(container) {
    var that = this; //Singleton
    this.Container = container;
    this.ExpandedClass = $(this.Container).data('expandedclass');
    this.DefaultClass = $(this.Container).data('defaultclass');

    $(this.Container).find('.ExpandableContainerToggle').click(function (btn) {
        this.Toggle(btn);
    }.bind(this));

   
}

ExpandableTextArea.prototype = {
    Toggle: function (btn) {
        var c = $(this.Container);

        var tf = $(btn.target).parent().find('textarea');
        var t = c.find("textarea");

        c.toggleClass(this.DefaultClass, 100, "easeOutSine");
        c.toggleClass(this.ExpandedClass, 100, "easeOutSine");

        t.each(function (index, element) {
            $(element).toggleClass("expandedtextarea", 100, "easeOutSine");
        });
        
        var etop = tf.offset().top;
        scrollBy(0, etop + 130);        
        tf.focus();
    }
}

$(function () {
    var headers = $(".ExpandableTextArea");
    for (var i = 0; i < headers.length; i++) {
        var h = new ExpandableTextArea(headers[i]);
    }

});
