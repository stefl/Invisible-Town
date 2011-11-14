// Put your application scripts here

$(function() {
    var maps;
    var $map = $("#map");
    var $map_image = $("#map_image");
    var $map_markers = $("#map_markers");
    
    $map.height($(window).height());
    $map.width($(window).width());
    
    $.getJSON("/maps.json", function(data) {
        maps = data.maps;
        openMap(maps[0]);
    });
    
    function getMap(slug) {
        return(_.find(maps, function(m){ 
            return m.slug ==  slug; 
        }));
    }
    
    function openMap(map) {
        console.log("Open map");
        console.log(map);
        $map.data({map: map});
        $map_markers.empty(); // todo animate to
        $map_image.empty();
        $img = $("<img />");
        $img.attr("src", map.image)
            .css("height", $(window).height())
            .hide();
        $map.find("#map_image").append($img);
        $img.load(function() {
            var left = ($(window).width() - $img.width())/2 + "px";
            console.log(left);
            $("#map_image").css({left: left });
            $(this).fadeIn(function() {
                $map_image.width($img.width());
                $map_markers.width($img.width());
                $map_markers.css({left: $img.offset().left})
                    .fadeIn();
            });
        })
        
        var tabindex = 1;
        $map_markers.hide();
        $.each(map.doors_from, function(i, e) {
            var $door = $("<a class='tip door' />");
            $door
                .attr("title", "Go to the " + $(e).to + " map")
                .data("door", e)
                .css("left", e.x + "%")
                .css("top", e.y + "%")
                .attr("tabindex", tabindex)
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
                .css("left", e.x + "%")
                .css("top", e.y + "%")
                .attr("tabindex", tabindex)
                .click(function() { showStory($(this).data.story); });
            $map_markers.append($story);
            tabindex = tabindex + 1;
        });
        $(".tip").tipTip();
    }
    
    function showStory(story) {
        
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