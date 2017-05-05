VideoApp.Views.NavView = Backbone.View.extend({

    initialize: function(options) { 
        var self = this;
        this.model = new VideoApp.Models.Nav({usuario: ""});

        this.model.on('change', this.render, this);
        this.render();
    },
    el: '#nav',
    template: _.template( 
        '<ul>' +
            '<li><a href="#home">Home</a></li>' +
            '<li><a href="#" onclick="VideoApp.logout();"><%= usuario %></a></li>' +
        '</ul>'
    ),
    render: function()
    {
        this.$el.html(this.template(this.model.toJSON()));       
        return this;
    }
});