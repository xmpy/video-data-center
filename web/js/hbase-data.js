//init function
$(function(){

    $("#nav-hdfs-filelist").css('background-color','rgb(0, 185, 226)');
    
    initTopLeftBar();
});

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
    $("#hdfs-filelist-wrapper").addClass("hdfs-filelist-wrapper-expanded").removeClass("hdfs-filelist-wrapper-collapse")

}

function collapseLeftSideBar() {
    $(this).addClass("side-nav-collapsed").removeClass("side-nav-expanded");
    $("#secondary-nav-top").addClass("secondary-nav-top-left").removeClass("secondary-nav-top-right");
    $("#hdfs-filelist-wrapper").addClass("hdfs-filelist-wrapper-collapse").removeClass("hdfs-filelist-wrapper-expanded")
}
