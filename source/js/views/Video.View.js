// VideoView: Handles single video view.
// THIS EXTEND FROM VIDEOS VIEW
VideoApp.Views.VideoView = VideoApp.Views.VideosView.extend({

    initialize: function(options) {

        // Render new view
        this.render();
    },
    el: '#video-container',
    template: _.template(
        // Single Video
        '<article class="video-item" id="vid-<%= video._id%>">' +
            
        // Video title
        '<h4><span class="video-link"><%= video.name %></span></h4>' +

        // HTML5 video player
        '<video onplaying="VideoApp.pauseVideos(this)" width="90%" controls>' +
            '<source src="<%= video.url%>" type="video/mp4">' +
            'Your browser does not support the video tag.' +
            '</video>' +
        '<div class="rating">' +
        
        // Stars logic
        '<% ' +
        'pre_stars = _.reduce(video.ratings, function(rtng, num) { ' +
                    'return rtng + num; ' +
        '}, 0) / (video.ratings.length === 0 ? 1 : video.ratings.length) %>' +
        '<% stars = Math.ceil(pre_stars) %>' +
        '<% for(i=1; i<=5; i++){ %>'+
            '<% if(stars >= i){ %>' +
                '<span data-rate-stars="<%= i%>" data-vid="<%= video._id%>" class="star star-selected star-<%= i%>"></span>' +
            '<% } else { %>' +
                '<span data-rate-stars="<%= i%>" data-vid="<%= video._id%>" class="star star-unselected star-<%= i%>"></span>' +
            '<% } %>' +
        '<% } %>' +
        '</div>' +

        '<div class="rate-alert-<%= video._id%>"></div>' +
            
            // // Description
            '<div class="description"><%= video.description %></div>' +
        '</article>' +

        // Sidebar
        '<aside>' +
        '<% _.each(collection, function(video) { %>' +

            '<article class="video-item aside-item" id="vid-<%= video._id%>">' +
                
                // Video title
                '<a class="video-link" href="#video?videoId=<%= video._id%>"><h4><%= video.name %></h4></a>' +

                // HTML5 video player
                '<video onplaying="VideoApp.pauseVideos(this)" width="90%" controls>' +
                    '<source src="<%= video.url%>" type="video/mp4">' +
                    'Your browser does not support the video tag.' +
                    '</video>' +
                '<div class="rating">' +
                
                // Stars logic
                '<% ' +
                'pre_stars = _.reduce(video.ratings, function(rtng, num) { ' +
                            'return rtng + num; ' +
                '}, 0) / (video.ratings.length === 0 ? 1 : video.ratings.length) %>' +
                '<% stars = Math.ceil(pre_stars) %>' +
                '<% for(i=1; i<=5; i++){ %>'+
                    '<% if(stars >= i){ %>' +
                        '<span data-rate-stars="<%= i%>" data-vid="<%= video._id%>" class="star star-selected star-<%= i%>"></span>' +
                    '<% } else { %>' +
                        '<span data-rate-stars="<%= i%>" data-vid="<%= video._id%>" class="star star-unselected star-<%= i%>"></span>' +
                    '<% } %>' +
                '<% } %>' +
                '</div>' +

                '<div class="rate-alert-<%= video._id%>"></div>' +
                    
                    // // Description
                    '<div class="description"><%= s(video.description).truncate(200)._wrapped %></div>' +
            '</article>' +

        '<% }); %>' +
        '</aside>'
    ),
    render: function()
    {
        this.$el.html(this.template({video:this.model.toJSON().data, collection: this.collection.toJSON()}));      
        return this;
    },
    destroy: function()
    {
        this.undelegateEvents();
        this.$el.removeData().unbind();
        this.$el.empty();
    }
});