window.maps = map_data.maps;

$(function() {
    
    window.InvisibleTownRouter = Backbone.Router.extend({

        routes: {
            "": "home",
            "maps/:slug/stories/:id": "story",
            "maps/:slug": "map"
        },

        map: function(slug) {
            showMap(getMap(slug));
        },

        about: function() {

        },

        home: function() {
            showMap(maps[0]);
        },
        
        story: function(slug, id) {
            var map = getMap(slug);
            showMap(map);
            var story = getStory(map, id);
            showStory(story);
        },

        initialize:function(){
        }

    });

    window.App = {
        init: function() {
            this.router = new InvisibleTownRouter();
            try {
                Backbone.history.start();
            } catch(e) {
                console.log(e.stack);
                console.log("cannot start history");
            }
        }
    };
    
    var $map = $("#map");
    var $map_image = $("#map_image");
    var $map_markers = $("#map_markers");
    var $map_title = $("#stories_title");
    var $fader = $("#fader");
    var $story = $("#story");
    var $back = $("#back");
    var $tip_holder = $("#tiptip_holder");
    var currentMap;
    
    function resetView() {
        $map.height($(window).height());
        $map.width($(window).width());
        $fader.css("width", $(window).width()).css("height", $(window).height());
    }
    
    $story.hide();
    $fader.hide();
    $back.hide();
    
    $fader.click(function(){ document.location.href = "#maps/" + currentMap.slug; });
    
    resetView();
        
    function getMap(slug) {
        return(_.find(maps, function(m){ 
            return m.slug ==  slug; 
        }));
    }
    
    function getStory(map, id) {
        return(_.find(map.stories, function(m) {
            return m.id == id;
        }));
    }
    
    $(window).bind("resize", function() {
        var map = $map.data().map;
        if(map) {
            resetView();
            var $img = $map_image.find("img.active");
            $img.css("height", $(window).height());
            var left = ($(window).width() - $img.width())/2 + "px";
            $img.css({left: left });
            $.each($map_markers.find("a"), function(i, e) {
                $e = $(e);
                $e.css("left", ($e.data().x * ($img.width() / 100.0)) + $img.offset().left - 12 + "px")
                    .css("top", ($e.data().y * ($img.height() / 100.0)) - 12 + "px");
            });
        }
    })
    
    function showMap(map) {
        currentMap = map;
        console.log("showMap");
        hideStory();
        
        $fader.stop().fadeOut();
        $tip_holder.fadeOut();
        $map_title.text(map.title);
        $map.data({map: map});
        $map_image.find("img").removeClass("active").addClass("inactive").fadeOut(function() { $(this).remove(); });
        $img = $("<img />");
        $img
            .addClass("active")
            .attr("src", map.image)
            .css("height", $(window).height())
            .css("position", "absolute")
            .css("top","0px")
            .hide();
        $map.find("#map_image").append($img);
        $img.load(function() {
            var left = ($(window).width() - $img.width())/2 + "px";
            $img.css("left", left);
            $(this).fadeIn(function() {
                $map_markers
                    .fadeIn();
            });
    
            var tabindex = 1;
            $map_markers.empty().hide();
            $.each(map.doors_from, function(i, e) {
                var $door = $("<a class='tip door' />");
                var door_map = getMap(e.to);
                $door
                    .text("+")
                    .attr("title", door_map.title)
                    .attr("href", "/#maps/" + e.to)
                    .data("door", e)
                    .data("x", e.x)
                    .data("y", e.y)
                    .css("position", "absolute")
                    .css("z-index", "10000")
                    .css("left", (e.x * ($img.width() / 100.0)) + $img.offset().left - 12 + "px")
                    .css("top", (e.y * ($img.height() / 100.0)) - 12 + "px")
                    .attr("tabindex", tabindex)
                    .hide()
                    .fadeIn();
                    
                $map_markers.append($door);
                tabindex = tabindex + 1;
            });
            
            if(map.doors_to.length == 0) {
                $back.fadeOut();
            }
            else {
              $back.fadeIn();
              $back.attr("href", "#maps/" + map.doors_to[0].from);
            }
    
            $.each(map.stories, function(i, e) {
                var $story = $("<a class='tip story' />");
                $story
                    .attr("title", e.title)
                    .attr("href", "#maps/" + map.slug + "/stories/" + e.id)
                    .data("story", e)
                    .data("x", e.x)
                    .data("y", e.y)
                    .css("position", "absolute")
                    .css("z-index", "10000")
                    .css("left", (e.x * ($img.width() / 100.0)) - 12 + $img.offset().left + "px")
                    .css("top", (e.y * ($img.height() / 100.0)) - 12 + "px")
                    .hide()
                    .fadeIn()
                    .attr("tabindex", tabindex)
                $map_markers.append($story);
                tabindex = tabindex + 1;
            });
            
            $(".tip").tipTip();
            $(".story, .door").mouseover(function(){
                $(this).stop().animate({
                    marginTop: '-10px',
                    marginLeft: '-10px',
                    width: '44px',
                    height: '44px',
                    fontSize: '32px'
            
                })
            });

            $(".story, .door").mouseout(function(){
                $(this).stop().animate({
                    marginTop: '0px',
                    marginLeft: '0px',
                    width: '24px',
                    height: '24px',
                    fontSize: '16px'
                })
            });
        });
    }
    
    function showStory(story) {
        console.log("showStory");
        $("#tiptip_holder").fadeOut();
        $fader.stop().fadeIn();
        
        $story.slideUp(function(){
            $story.empty();
            var $title = $("<h1 />").text(story.title);
            var $done_button = $("<a class='done_button'>Done</a>");
            $done_button.click(function(){ hideStory(); $fader.stop().fadeOut(); });
            $story.append($title);
            
            console.log($story);
            
            if(!_(story.soundcloud_track_id).blank()) {
                $("#soundcloudTemplate").tmpl(story).appendTo($story);
            }
            
            if(!_(story.aframe_clip_id).blank()) {
                $("#aframeTemplate").tmpl(story).appendTo($story);
            }
            
            if(!_(story.image_url).blank()) {
                $("#imageTemplate").tmpl(story).appendTo($story);
            }
            
            if(!_(story.description).blank()) {
                $(story.description_html).appendTo($story);
            }
                
            $story
                //.append($done_button)
                .slideDown();
        });
    }
    
    function hideStory() {
        console.log("hideStory");
        $story.slideUp(function(){ $story.empty(); });
    }
    
    $("#background, #stories_title").click(function() {
        window.history.back();
        return(false);
    });
    
    $(".tip").tipTip();
    
    App.init();
})