//输入文件路径
var inputPath = "";

//init function
$(function(){
    $("#nav-video-analyze").css('background-color','rgb(0, 185, 226)');

    //关闭已上传至提示栏
    $("#upload-success-alert").hide();

    //关闭上传中提示
    $("#upload-process").hide();
    initTopLeftBar();
	hdfsListInit();
    uploadButtonInit();

    //初始化转换视频格式
    videoSetting.setting();
    $("#choose_format").change(videoSetting.chooseFormat);
    $("#choose_code").change(videoSetting.chooseCode);
    $("#run_job").click(videoSetting.runJob);

    //关闭转码提示
    $("#run-process").hide();

   // $("#nav-hdfs-filelist").css('background-color','rgb(0, 185, 226)');
    //initializeMap();
});

function uploadButtonInit(){

        $('#close-alert-button').bind('click',function(){
            $('#upload-success-alert').hide();

        });

        $('#upload-button-real').fileupload({
        dataType:'text',
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            console.log(progress + '%');
            //$("div[class=progress-bar]").css("width",progress+"%");
            $("#upload-process").show();
        },
        singleFileUploads: false,   
        done: function (e, data) {
        console.log("Done");

        console.log(data.result);
        $('#upload-success-alert').show();
        $('#upload-success-alert').html("已上传至： "+data.result +'<button type="button" class="close" id="close-alert-button">×</button>');
       // $('#choose_file_alert').text("您的输入是： "+data.result);

        $('#close-alert-button').bind('click',function(){
            $('#upload-success-alert').hide();

        });
        
        $("#upload-process").hide();         
        $("#HDFS_list").jstree("refresh");
        }       
    });
}


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
    $("#hdfs-filelist-wrapper").addClass("hdfs-filelist-wrapper-expanded").removeClass("hdfs-filelist-wrapper-collapse")

}

function collapseLeftSideBar() {
    $(this).addClass("side-nav-collapsed").removeClass("side-nav-expanded");
    $("#secondary-nav-top").addClass("secondary-nav-top-left").removeClass("secondary-nav-top-right");
    $("#hdfs-filelist-wrapper").addClass("hdfs-filelist-wrapper-collapse").removeClass("hdfs-filelist-wrapper-expanded")
}

var downloadFunc = {

    downloadFile:function(){
        var url="http://10.103.241.118/webapps/VideoDataCenter/hdfsfileplay.do";
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            data:{
                path:selectedPath,
            },
            success: function(data){
                //返回视频文件路径
                downloadFunc.onSuccess(data);
            },
            error: function(){
                alert("Error Occur!");
                //mainController.popup("Erorr Occurs");
            }
        });

    },
    onSuccess : function(data){
        var baseFilePath = data.filepath.substring(data.filepath.lastIndexOf('/')+1, data.filepath.Length);
        console.log(data.filepath);
        window.location.href = "downloads/"+encodeURIComponent(baseFilePath);
    },

}

function hdfsListInit(){
    $('#HDFS_list').jstree({
      "core" : {
        "animation" : 0,
        "themes" : { "stripes" : true },
        'data' : {
          'url' : 'http://10.103.241.118/webapps/VideoDataCenter/hdfsfilelist.do',
          'dataType' : 'json',
          'data' : function (node) {
            return { 'id' : node.id };
          }
        }
      },
      "types" : {
        "#" : {
          "max_children" : 1, 
          "max_depth" : 4, 
          "valid_children" : ["root"]
        },
        "root" : {
          "icon" : "/static/3.0.0-beta8/assets/images/tree_icon.png",
          "valid_children" : ["default"]
        },
        "default" : {
          "valid_children" : ["default","file"]
        },
        "file" : {
          "icon" : "glyphicon glyphicon-file",
          "valid_children" : []
        }
      },
      "plugins" : [
        "contextmenu", "dnd", "search",
        "state", "types", "wholerow"
      ]
    }).bind("select_node.jstree", function(e,data) { 
        var node_id =data.node.id; 
        $('#choose_file_alert').html("文件路径： "+node_id);
        $("#choose_file_alert").show();
        inputPath = node_id;
        selectedPath = node_id;
        /*
        var suffix = node_id.substring(node_id.lastIndexOf('.')+1, node_id.Length);
        if(suffix == "mp4" || suffix == "flv"){
            $("#img_from_grid").hide();
            $("#not_preview_info").hide();
            $('#video_from_grid').show();
            videoPlay.handlePlayVideo(selectedPath);
        }else if (suffix == "png" || suffix == "jpg") {
            $("#img_from_grid").show();
            $("#not_preview_info").hide();
            $('#video_from_grid').hide();
            imgShow.handleImgShow(selectedPath);
        }else{
            $("#img_from_grid").hide();
            $("#not_preview_info").show();
            $('#video_from_grid').hide();
        }
        */

        console.log(node_id);
    }); 
}

var videoSetting = {
    formatMapping : {avi:[{code:"H263",size:""},{code:"H264", size:"176*144"}, {code:"H2639",size:""},{code:"H261",size:""},{code:"MPEG4",size:""},{code:"WMV",size:""},{code:"WMV2",size:""},{code:"MPEG1VIDEO",size:""},{code:"MPEG2VIDEO",size:""}],mp4: [{code:"MPEG4",size:""},{code:"H264",size:"176*144"},{code:"MPEG1VIDEO",size:""},{code:"MPEG2VIDEO",size:""}],flv:[{code:"FLV1",size:""},{code:"H264",size:"176*144"}]},
    codeMapping: {H264:[{size:"176*144"},{size:"352*288"}], Other:[{size:"176*144"},{size:"352*288"},{size:"128*720"},{size:"320*240"},{size:"720*480"}]},
    setting : function(){
        console.log("ddd");
        console.log(videoSetting.formatMapping);

        $("#choose_format").html("");
        $.each(videoSetting.formatMapping, function(name,value){
            console.log(name);
            console.log(value);
            var selectElement = $("<option>");
            selectElement.text(name);
            $("#choose_format").append(selectElement);
        });

        $("#choose_code").html("");
        $.each(videoSetting.formatMapping.avi, function(index, c){
            var selectElement = $("<option>");
            selectElement.text(c["code"]);
            $("#choose_code").append(selectElement);
        });

        $.each(videoSetting.codeMapping.Other, function(index, c){
            var selectElement = $("<option>");
            selectElement.text(c["size"]);
            $("#choose_hw").append(selectElement);
        });
    },
    chooseFormat : function(){
        $("#choose_code").html("");
        console.log($("#choose_format option:selected").text());
        console.log(videoSetting.formatMapping[$("#choose_format option:selected").text()]);
        var selected = videoSetting.formatMapping[$("#choose_format option:selected").text()];
        $.each(selected,function(index, c){
            var selectElement = $("<option>");
            selectElement.text(c["code"]);
            $("#choose_code").append(selectElement);
        });

    },
    chooseCode : function(){
        $("#choose_hw").html("");
        if($("#choose_code option:selected").text() == "H264"){
            $.each(videoSetting.codeMapping.H264, function(index, c){
            var selectElement = $("<option>");
            selectElement.text(c["size"]);
            $("#choose_hw").append(selectElement);
        });
        }
        else{
            $.each(videoSetting.codeMapping.Other, function(index, c){
            var selectElement = $("<option>");
            selectElement.text(c["size"]);
            $("#choose_hw").append(selectElement);
        });
        }
    },
    runJob : function(){
        console.log("run hob!!");
        $("#run-process").show();
        var format = $("#choose_format option:selected").text();
        var code = $("#choose_code option:selected").text();
        var bit = $("#choose_bit option:selected").text();
        var fps = $("#choose_fps option:selected").text();
        var hw = $("#choose_hw option:selected").text();
        console.log(hw);
        console.log("input path:"+inputPath);
        console.log(format+" "+code+" "+bit+" "+fps+" "+hw);
        mainModel.runjob(inputPath,format,code,bit,fps,hw,videoSetting.onSuccess);
    },
    onSuccess : function(){
        $("#run-process").hide();
        $("#HDFS_list").jstree("refresh");
        alert("转换成功");
    },
};
