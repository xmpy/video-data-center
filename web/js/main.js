//init function
$(function(){

    //首页标签蓝色
    $("#nav-index").css('background-color','rgb(0, 185, 226)');

    //当一个手风琴被展开的时候
	$('.panel-collapse').on('show.bs.collapse', function () {
	  // do something…
	  	$(this).parent().css('background-color','rgb(0, 185, 226)');
        $(this).parent().children('.panel-heading').css('background-color','rgb(0, 185, 226)');

	  	console.log("collapseOne opened");
		$("#main-nav-left").unbind('mouseout',collapseLeftSideBar);
	});

    //当一个手风琴被隐藏时
	$('.panel-collapse').on('hide.bs.collapse', function () {
	  // do something…
	  	//恢复按钮宽度
	  	$(this).parent().css('height','40px');

        $(this).parent().css('background-color','#444');
        $(this).parent().children('.panel-heading').css('background-color','#444');

	  	console.log("collapseOne closed");
		$("#main-nav-left").bind('mouseout',collapseLeftSideBar);
	});
	//initializeMap();
});

function initializeMap() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-view-container"),
            mapOptions);
}
function initTopLeftBar(){
    //左边栏收缩
    $("#main-nav-left").bind('mouseover',expandLeftSideBar);
    
    $("#main-nav-left").bind('mouseout',collapseLeftSideBar);

    $(".nav-heading").bind('click',navButtonChangeColor);
    
}

function navButtonChangeColor(){
    console.log("change color");
    $(this).css('background-color','rgb(0, 185, 226)');
}

function expandLeftSideBar(){
   // $('.nav-heading').css('overflow','40px');
	$(this).addClass("side-nav-expanded").removeClass("side-nav-collapsed");
    $("#secondary-nav-top").addClass("secondary-nav-top-right").removeClass("secondary-nav-top-left");
}

function collapseLeftSideBar() {
	$(this).addClass("side-nav-collapsed").removeClass("side-nav-expanded");
    $("#secondary-nav-top").addClass("secondary-nav-top-left").removeClass("secondary-nav-top-right");

}