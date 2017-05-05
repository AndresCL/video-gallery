VideoApp.Views.HomeView = Backbone.View.extend({

    initialize: function(options) {

        // Initializing
        var self = this;

        // Render view
        this.render();
    },
    url: function(){
        return VideoApp.API + VideoApp.URL_AUTH;
    },
    el: '#login-container',
    events: {
        "click .btn-login": "loginUser",
    },
    loginUser: function() {

        // Get data from inputs
        var user = $("#username").val();
        var pass = $.md5($("#password").val());
        
        // Helper
        var self = this;
        
        // Calling server
        $.ajax({
            url: this.url(),
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: '{"username": "' + user + '", "password": "' + pass + '"}',
            success: function(res){
                
                // If success, save user login data
                if(res.status == "success"){

                    // Hide login
                    $(".login").hide();

                    // Saving for future use
                    VideoApp.User.username = res.username;
                    VideoApp.User.ssid = res.sessionId;

                    // Navigate to videos
                    VideoApp.rt.navigate('videos', {trigger: true}); 
                    
                }
                // Show error msg
                else if(res.status == "error"){
                    $(".msg-alert").html('<strong>Error:</strong> ' + res.error);
                    $(".msg-alert").fadeIn(4000).fadeOut(2000);
                }
                // Show error msg
                else{
                    $(".msg-alert").html('<strong>Error:</strong> Stranger Things have happened...');
                    $(".msg-alert").fadeIn(4000).fadeOut(2000);
                }

            },
            // Show error msg
            error: function(mod, res){
                $(".msg-alert").html('<strong>Error: </strong> Stranger Things have happened...');
                $(".msg-alert").fadeIn(4000).fadeOut(2000);
            }
        });
    },

    template: _.template(
            
            // If user is not logged in
            '<% if(VideoApp.User.ssid == "") { %>' +
                '<section class="login">' +
                    '<input type="text" id="username" placeholder="Username" value="ali"> ' +
                    '<input type="password" id="password" placeholder="Password" value="password"> ' +
                    '<button type="button" class="btn-login"><span>Login</span></button>' +
                    '<div class="msg-alert" style="display:none"></div>' +
                '</section>' +
            '<% } %>'
    ),
    render: function()
    {
        // Show login
        $(".login").show();

        this.$el.html(this.template());      
        return this;
    }
});