// Collection to handle video list
VideoApp.Collections.Videos = Backbone.Collection.extend({
    initialize: function(){
    },
    url: function(){
        return VideoApp.API + VideoApp.URL_VIDEOS
    },
    model: VideoApp.Models.VideoModel,
    parse:  function(response) {
        return response.data;
    }
}); 