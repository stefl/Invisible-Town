// Put your application scripts here

$(function() {
    var maps;
    var $map = $("#map");
    var $map_image = $("#map_image");
    var $map_markers = $("#map_markers");
    var $map_title = $("#stories_title");
    var $story = $("#story");
    
    function resetView() {
        $map.height($(window).height());
        $map.width($(window).width());
    }
    
    $story.hide();
    
    resetView();
    
    $.getJSON("/maps.json", function(data) {
        maps = data.maps;
        openMap(maps[0]);
    });
    
    function getMap(slug) {
        return(_.find(maps, function(m){ 
            return m.slug ==  slug; 
        }));
    }
    
    $(window).bind("resize", function() {
        var map = $map.data().map;
        if(map) {
            resetView();
            $map_image.find("img").css("height", $(window).height());
            var $img = $map_image.find("img");
            var left = ($(window).width() - $img.width())/2 + "px";
            $map_image.css({left: left });
            $.each($map_markers.find("a"), function(i, e) {
                console.log(e);
                $e = $(e);
                $e.css("left", ($e.data().x * ($img.width() / 100.0)) + $img.offset().left - 12 + "px")
                    .css("top", ($e.data().y * ($img.height() / 100.0)) - 12 + "px");
            });
        }
    })
    
    function openMap(map) {
        $("#tiptip_holder").fadeOut();
        console.log("Open map");
        console.log(map);
        $map_title.text(map.title);
        $map.data({map: map});
        $map_image.find("img").fadeOut();
        $map_image.empty();
        $img = $("<img />");
        $img.attr("src", map.image)
            .css("height", $(window).height())
            .hide();
        $map.find("#map_image").append($img);
        $img.load(function() {
            var left = ($(window).width() - $img.width())/2 + "px";
            $map_image.css({left: left });
            $(this).fadeIn(function() {
                console.log("fade me in");
                $map_image.width($img.width());
                $map_markers
                    .fadeIn();
            });
    
            var tabindex = 1;
            $map_markers.empty().hide();
            $.each(map.doors_from, function(i, e) {
                var $door = $("<a class='tip door' />");
                $door
                    .text("+")
                    .attr("title", "Go to the " + e.to + " map")
                    .data("door", e)
                    .data("x", e.x)
                    .data("y", e.y)
                    .css("position", "absolute")
                    .css("z-index", "10000")
                    .css("left", (e.x * ($img.width() / 100.0)) + $img.offset().left - 12 + "px")
                    .css("top", (e.y * ($img.height() / 100.0)) - 12 + "px")
                    .attr("tabindex", tabindex)
                    .hide()
                    .fadeIn()
                    .click(function() { 
                        var $elem = $(this);
                        var map = getMap($elem.data().door.to);
                        openMap(map); 
                    });
                $map_markers.append($door);
                tabindex = tabindex + 1;
            })
    
            $.each(map.stories, function(i, e) {
                var $story = $("<a class='tip story' />");
                $story
                    .attr("title", e.title)
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
                    .click(function() { showStory($(this).data().story); });
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
        $("#tiptip_holder").fadeOut();
        
        $story.slideUp(function(){
            $story.empty();
            var $title = $("<h1 />").text(story.title);
            var $done_button = $("<a class='done_button'>Done</a>");
            $done_button.click(function(){ hideStory(); });
            $story
                .append($title)
                .append($done_button)
                .slideDown();
        });
    }
    
    function hideStory() {
        $story.slideUp();
    }
    
    function goBack() {
        var door = $map.data().map.doors_to[0];
        console.log(door);
        openMap(getMap(door.from));
    }
    
    $("#background, #stories_title").click(function() {
        goBack();
        return(false);
    });
    
    $(".tip").tipTip();
})