// VideosView: Handles video list
VideoApp.Views.VideosView = Backbone.View.extend({

    initialize: function(options) {

        var self = this;
        this.loadedVideos = 0;
        this.isLoading = false;
        $("#videos-container").show();

        // Listener to see when to load new videos when scroll is at the bottom
        $(window).bind('scroll',function() {

            // Calculating distance
            var distanceFromBottom = document.body.scrollHeight - window.innerHeight - window.scrollY;

            // Avoid extra calls with timeout 
            setTimeout(function(){

                if(distanceFromBottom <= 20 && !self.isLoading){
                
                    // Flag to avoid double calls
                    self.isLoading = true;

                    // Load videos from server (max 10 videos with skip)
                    VideoApp.videoCollection.fetch({ 
                        data: $.param({ sessionId: VideoApp.User.ssid, limit: VideoApp.lazyLoadVideos, skip: VideoApp.videoCollection.loadedVideos}),
                        remove: false, // Indicating to not overwrite old records but incremental
                        error: onErrorHandler = function(collection, response, options) {
                            // TODO HANDLE FETCH ERROR
                        }
                    }).done(function(){

                        // Flag to avoid double calls
                        self.isLoading = false;

                        // Incrementing counter to use as skip
                        VideoApp.videoCollection.loadedVideos += VideoApp.lazyLoadVideos;

                        // Rendering video view
                        VideoApp.videosView.render();
                    });
                }
            }, 1500);   
        }); 

    },
    rateUrl: function(){
        return VideoApp.API + VideoApp.URL_VIDEO + "/" + VideoApp.URL_VIDEO_RANK + "?sessionId=" + VideoApp.User.ssid;
    },
    el: '#videos-container',
    events: {
        "click .video-link": "videoDetails",
        "click .star-selected": "videoRate",
        "click .star-unselected": "videoRate"
    },

    // Event listener to click on video rate
    videoRate: function(event){

        // Getting ID from click event on title
        var videoId = $(event.currentTarget).data('vid');
        var videoRate = $(event.currentTarget).data('rate-stars');

        // Remove behavior from stars
        $("#vid-" + videoId + " .star").removeClass("star-selected");
        $("#vid-" + videoId + " .star").removeClass("star-unselected");
        $("#vid-" + videoId + " .star").removeClass("star-jumping");

        // Calling server
        $.ajax({
            url: this.rateUrl(),
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: '{"videoId": "' + videoId + '", "rating": "' + videoRate + '"}',
            success: function(res){
                
                // If success, save user login data
                if(res.status == "success"){
                    
                    // Rate text
                    $(".rate-alert-" + videoId).html("Rated " + videoRate + " star(s).");

                    // Add jumping star according to selection
                    for(i=1; i<=5; i++){   
                        if(i <= videoRate) $("#vid-" + videoId + " .star-" + i).addClass("star-jumping");
                    }
                }
                // Show error msg
                else if(res.status == "error"){
                    $(".rate-alert-" + videoId).html('<strong>Error:</strong> ' + res.error);
                    $(".rate-alert-" + videoId).fadeIn(4000).fadeOut(2000);
                }
                // Show error msg
                else{
                    $(".rate-alert-" + videoId).html('<strong>Error:</strong> Stranger Things have happened...');
                    $(".rate-alert-" + videoId).fadeIn(4000).fadeOut(2000);
                }

            },
            // Show error msg
            error: function(mod, res){
                $(".rate-alert-" + videoId).html('<strong>Error: </strong> Stranger Things have happened...');
                $(".rate-alert-" + videoId).fadeIn(4000).fadeOut(2000);
            }
        });

    },
    template: _.template(
        // Listing videos
        '<% _.each(collection, function(video) { %>' +
            '<div class="video-item" id="vid-<%= video._id%>">' +
                
                // Video title
                '<h5><a class="video-link" href="#video?videoId=<%= video._id%>"><%= video.name %></h5></a>' +

                // HTML5 video player
                '<video onplaying="VideoApp.pauseVideos(this)" width="90%" height="180" controls>' +
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
                
                // Description
                '<div class="description"><%= s(video.description).truncate(200)._wrapped %></div>' +
            '</div>' +
        '<% }); %>'
    ),
    render: function()
    {
        this.$el.html(this.template({collection: VideoApp.videoCollection.toJSON()}));      
        return this;
    },
    // Destroy the view
    destroy: function(){
        
        $("#videos-container").hide(); // to avoid div take it relative space
        $(window).unbind("scroll");
        this.undelegateEvents();
        this.$el.removeData().unbind();
        this.$el.empty();
    }
});