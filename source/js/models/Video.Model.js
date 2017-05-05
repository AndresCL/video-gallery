// Initializing model for videos
VideoApp.Models.VideoModel = Backbone.Model.extend({
    urlRoot: VideoApp.API + VideoApp.URL_VIDEO,
    parse: function (response) { 
        return response;
    }
});