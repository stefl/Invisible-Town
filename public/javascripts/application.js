window.maps = map_data.maps;

$(function() {
    
    window.InvisibleTownRouter = Backbone.Router.extend({

        routes: {
            "": "home",
            "maps/:slug/stories/:id": "story",
            "maps/:slug": "map"
        },

        map: function(slug) {
            var map = getMap(slug);
            if(map) {
              showMap(map);
            }
            else {
                apprise("Sorry, I can't find where you're trying to go...");
            }
        },

        about: function() {

        },

        home: function() {
            showMap(maps[0]);
        },
        
        story: function(slug, id) {
            var map = getMap(slug);
            if(map) {
              showMap(map);
            }
            else {
                apprise("Sorry, I can't find where you're trying to go...");
            }
            var story = getStory(map, id);
            if(story) {
              showStory(story);
            }
            else {
                apprise("Sorry, I can't find that story. It might only be available at certain times of day?");
            }
        },

        initialize:function(){
        }

    });

    var Story = Backbone.Model.extend({
    });

    window.FoundStoriesCollection = Backbone.Collection.extend({
      localStorage: new Store("FoundStoriesCollection"), // Unique name within your app.
      model: Story
    });

    window.ContextStoriesCollection = Backbone.Collection.extend({
      model: Story
    });

    window.VisitedStories = new FoundStoriesCollection;

    VisitedStories.fetch();

    window.SidebarStories = new ContextStoriesCollection;

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
    var $greeting = $("#greeting");
    var $fader = $("#fader");
    var $story = $("#story");
    var $back = $("#back");
    var $tip_holder = $("#tiptip_holder");
    var $sidebar = $("#sidebar");
    var $sidebar_stories = $("#stories_for_this_map ul");
    var $sidebar_stories_title = $("#stories_for_this_map");
    var currentMap;
    
    $story.hide();
    $fader.hide();
    $back.hide();
        
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
    
    function resetView() {
        $map.height($(window).height());
        $map.width($(window).width());
        $fader.css("width", $(window).width()).css("height", $(window).height());
    }
    
    function showMap(map) {
        hideStory();
        $fader.hide();
        $map_markers.fadeOut();
        $tip_holder.fadeOut();
        if(map == currentMap) {
            $map_markers.fadeIn();
            return(false);
        }
        currentMap = map;
        $map.data({map: map});

        displayTitle();
        displayGreeting();
        displayMapImage();
        handleImageLoad();
    }

    function handleImageLoad() {
        $img.load(function() {
            var left = ($(window).width() - $img.width())/2 + "px";
            $img
                .removeClass("hidden")
                .css("left", left)
                .delay(500).fadeIn(1000, function() {
                    console.log("Faded image in");
                    addDoorsAndStoriesToMap();
                    addStoriesToSidebar();
                    setupBackButton();
                    attachMouseOverEvents();
                    $map_markers.show();
                });
        });
    }

    function displayTitle() {
        var map = $map.data().map;
        $map_title.text(map.title);
    }

    function displayMapImage() {
        var map = $map.data().map;
        $map_image.find("img").removeClass("active").addClass("inactive").fadeOut(function() { $(this).remove(); });
        $img = $("<img />");
        $img
            .addClass("active")
            .attr("src", map.image)
            .css("height", $(window).height() - 100)
            .css("position", "absolute")
            .css("top","0px")
            .hide();
        $map.find("#map_image").append($img);
    }

    function displayGreeting() {
        var map = $map.data().map;
        $greeting.hide();
        $greeting.text("");
        $greeting.text(map.greetings[Math.floor ( Math.random() * map.greetings.length )]);
        $greeting.delay(1500).fadeIn();
    }

    function setupBackButton() {
        var map = $map.data().map;
        if(map.doors_to.length == 0) {
            $back.fadeOut();
        }
        else {
          $back.fadeIn();
          $back.attr("href", "#maps/" + map.doors_to[0].from);
        }
    }

    function addStoriesToSidebar() {
        var map = $map.data().map;
        $sidebar_stories.empty();
        if(_(map.stories).blank) {
            $sidebar_stories_title.hide();
        }
        else {
            $sidebar_stories_title.show();
        }
        _.each(map.stories, function(story) {
            $("#storySidebarTemplate").tmpl(story).appendTo($sidebar_stories);
        });
    }

    function addDoorsAndStoriesToMap() {
        var map = $map.data().map;
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
                .css("top", 100 + (e.y * ($img.height() / 100.0)) - 12 + "px")
                .attr("tabindex", tabindex)
                .hide()
                .fadeIn();
                
            $map_markers.append($door);
            tabindex = tabindex + 1;
        });
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
                .css("top", 100 + (e.y * ($img.height() / 100.0)) - 12 + "px")
                .hide()
                .fadeIn()
                .attr("tabindex", tabindex)
            $map_markers.append($story);
            tabindex = tabindex + 1;
        });
    }

    function attachMouseOverEvents() {
        $(".tip").tipTip();
        $(".story, .door")
            .mouseover(function(){
                $(this).stop().animate({
                    marginTop: '-10px',
                    marginLeft: '-10px',
                    width: '44px',
                    height: '44px',
                    fontSize: '32px'
            
                })
            })
            .mouseout(function(){
                $(this).stop().animate({
                    marginTop: '0px',
                    marginLeft: '0px',
                    width: '24px',
                    height: '24px',
                    fontSize: '16px'
                })
            });
    }
    
    function showStory(story) {
        if(!VisitedStories.get(story.id)) {
            VisitedStories.create(story);
        }
        $("#tiptip_holder").fadeOut();
        $fader.show();
        
        $story.slideUp(function(){
            $story.empty();
            var $title = $("<h1 />").text(story.title);
            var $done_button = $("<a class='done_button'>Done</a>");
            $done_button.click(function(){ hideStory(); $fader.hide(); });
            $story.append($title);
                        
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

            if(!_(story.related_stories).blank()) {
                _.each(story.related_stories, function(related) {
                    var story_map = getMap(related.map_slug);
                    var related_story = getStory(story_map, related.id);
                    var data = { map: story_map, story: related_story};
                    if(data.map && data.story) {
                      $("#relatedStoryTemplate").tmpl(data).appendTo($story);
                    }
                });
            }

            if(!_(story.related_maps).blank()) {
                _.each(story.related_maps, function(related) {
                    var related_map = getMap(related.slug);
                    $("#relatedMapTemplate").tmpl(related_map).appendTo($story);
                });
            }
                
            $story
                .append($done_button)
                .slideDown();
        });
    }
    
    function nextStory() {
        var $viewing_story = $(".story.viewing").next();
        if($viewing_story.size() == 0) {
            $viewing_story = $(".story").first();
        }
        if($viewing_story.size() == 0) {
            return(false)
        }
        $(".story").removeClass("viewing");
        $viewing_story.addClass("viewing");
        document.location.href = $viewing_story.attr("href");
    }
    
    function prevStory() {
        var $viewing_story = $(".story.viewing").prev().find(".story");
        if($viewing_story.size() == 0) {
            $viewing_story = $(".story").last();
        }
        if($viewing_story.size() == 0) {
            return(false)
        }
        $(".story").removeClass("viewing");
        $viewing_story.addClass("viewing");
        document.location.href = $viewing_story.attr("href");    
    }
    
    function hideStory() {
        $story.slideUp(function(){ $story.empty(); });
    }
    
    $("#background, #stories_title").click(function() {
        window.history.back();
        return(false);
    });
    
    $(window).bind("resize", function() {
        var map = $map.data().map;
        if(map) {
            resetView();
            var $img = $map_image.find("img.active");
            $img.css("height", $(window).height() - 100);
            var left = ($(window).width() - $img.width())/2 + "px";
            $img.css({left: left });
            $.each($map_markers.find("a"), function(i, e) {
                $e = $(e);
                $e.css("left", ($e.data().x * ($img.width() / 100.0)) + $img.offset().left - 12 + "px")
                    .css("top", 100 + ($e.data().y * ($img.height() / 100.0)) - 12 + "px");
            });
        }
    });
    
    $(".tip").tipTip();
    
    $(window).bind("keydown", function(e) {
        var key = e.keyCode;
        var esc = 27;
        var left_arrow = 37;
        var right_arrow = 39;
        var down_arrow = 40;
        var up_arrow = 38;
       
        if(key == esc) {
           // Hide the current story
           document.location.href = "#maps/" + currentMap.slug;
        }
        else if(key == left_arrow) {
           prevStory();
        }
        else if(key == right_arrow) {
           nextStory();
        }
        else if(key == up_arrow) {
            // Back up a map level
            if(currentMap.doors_to.size != 0) {
                document.location.href = "#maps/" + currentMap.doors_to[0].from;
            }
        }
        else if(key == down_arrow) {
            // Down a map level
            if(currentMap.doors_from.size != 0) {
                document.location.href = "#maps/" + currentMap.doors_from[0].to;
            }
        }
    });
    
    $fader.click(function(){ document.location.href = "#maps/" + currentMap.slug; });
    
    resetView();
    
    App.init();
})