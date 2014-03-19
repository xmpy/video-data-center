$(function() {

	mainController._init();	
	console.log("init done");

    //mainModel.getClusterSummary(updateClusterSummary.update);
    videoSetting.setting();
    $("#choose_format").change(videoSetting.chooseFormat);
    $("#choose_code").change(videoSetting.chooseCode);
    $("#run_job").click(videoSetting.runJob);

	$("#HDFS_list")
		.jstree({ "plugins" :[ "themes", "html_data", "checkbox", "sort", "ui" ] })
		// 1) the loaded event fires as soon as data is parsed and inserted
		.bind("loaded.jstree", function (event, data) { })
		// 2) but if you are using the cookie plugin or the core `initially_open` option:
		.one("reopen.jstree", function (event, data) { })
		// 3) but if you are using the cookie plugin or the UI `initially_select` option:
		.one("reselect.jstree", function (event, data) { });
	var opts = {  
	  lines: 13, // 画的线条数  
	  length: 3, // 每条线的长度  
	  width: 2, // 线宽  
	  radius: 5, // 线的圆角半径  
	  corners: 1, // Corner roundness (0..1)  
	  rotate: 0, // 旋转偏移量  
	  direction: 1, // 1: 顺时针, -1: 逆时针  
	  color: '#000', // #rgb or #rrggbb or array of colors  
	  speed: 1, // 转速/秒  
	  trail: 60, // Afterglow percentage  
	  shadow: false, // 是否显示阴影  
	  hwaccel: false, // 是否使用硬件加速  
	  className: 'spinner', // 绑定到spinner上的类名  
	  zIndex: 2e9, // 定位层 (默认 2000000000)  
	  top: '5px', // 相对父元素上定位，单位px  
	  left: '5px' // 相对父元素左定位，单位px  
	};  
	var target = document.getElementById("jobspin");  
	var spinner = new Spinner(opts).spin(target);
	$("#jobspin").hide();


});

var updateClusterSummary = {
	update : function(data){
		console.debug(data.result);
		for(i=0; i < data.result.length; i++){
			var attrElement = $("<tr>");
			var nameElement = $("<td>");
			nameElement.text(data.result[i].name)
			attrElement.append(nameElement);
			var valElement = $("<td>");
			valElement.text(data.result[i].value);
			attrElement.append(valElement);

			$("#clustersummary_table").append(attrElement);
		}
	},
};

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
		$("#jobspin").show();
		var format = $("#choose_format option:selected").text();
		var code = $("#choose_code option:selected").text();
		var bit = $("#choose_bit option:selected").text();
		var fps = $("#choose_fps option:selected").text();
		var hw = $("#choose_hw option:selected").text();
		console.log(hw);
		console.log($("#hadoop_filepath").val());
		console.log(format+" "+code+" "+bit+" "+fps+" "+hw);
		mainModel.runjob($("#hadoop_filepath").val(),format,code,bit,fps,hw,videoSetting.onSuccess);
	},
	onSuccess : function(){
		$("#jobspin").hide();
		alert("转换成功");
	},
};

var mainController = {
	countPerPage: 50,
	currentPage: 1,
	totalPage: 1,
	data: null,
	keyword:"",
	categories:[],
	country:"all...",
	woeidMap:null,
	countryName:[],
	dateString:"",
	get_url_lists:[],
	handle_url_lists:[],
	urls_have_segment_lists:[],
	
	_init : function(){

		$('#upload_button').fileupload({
			dataType:'text',
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				console.log(progress + '%');
				$("div[class=progress-bar]").css("width",progress+"%");
			},	
			done: function (e, data) {
			console.log("Done");
			/*
			$.each(data.result, function (index, file) {
            $('<p/>').text(file.name + ' uploaded').appendTo($("body"));
			});
			*/
			console.log(data.result);
			$("#hadoop_filepath").val(data.result);			
			}		
		});
	},



	refreshChart:function(){
		$('#container').highcharts({
	    title: {
	        text: 'Hourly Job Statistic',
	        x: -20 //center
	    },
	    xAxis: {
	        categories: mainController.categories
	    },
	    yAxis: {
	        title: {
	            text: 'Count'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    tooltip: {
	    	shared: true,
	        crosshairs: true,
	    },

	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle',
	        borderWidth: 0
	    },
		exporting: { enabled: false },
	    series: [{
	        name: 'Get URLs',
	        data: mainController.get_url_lists
	    }, {
	        name: 'Handle URLs',
	        data: mainController.handle_url_lists
	    }, {
	        name: 'Get Segments URLs',
	        data: mainController.urls_have_segment_lists
	    }]
	    });
	},

	searchOnSuccess: function(data){
		$(".search_result_item").remove();

		mainController.data = data;
		mainController.categories = [];
		mainController.get_url_lists = [];
		mainController.handle_url_lists = [];
		mainController.urls_have_segment_lists = [];

		for(i = 0 ;i < data.length; i++){
			mainController.showRecord(i);
			mainController.categories.push(mainController.dateString+" "+i+":00");
			mainController.get_url_lists.push(mainController.data[i].get_urls_count);
			mainController.handle_url_lists.push(mainController.data[i].handle_urls_count);
			mainController.urls_have_segment_lists.push(mainController.data[i].urls_have_segment_count);
		}
		mainController.refreshChart();

	},
	showRecord: function(index){
		var docElement = $("<tr>");
		docElement.addClass("search_result_item");
		var dateElement = $("<td>");
		dateElement.text(mainController.dateString+" "+index+":00");
		docElement.append(dateElement);
		var geturlElement = $("<td>");
		geturlElement.text(mainController.data[index].get_urls_count);
		docElement.append(geturlElement);
		var handleElement = $("<td>");
		handleElement.text(mainController.data[index].handle_urls_count);
		docElement.append(handleElement);
		var segElement = $("<td>");
		segElement.text(mainController.data[index].urls_have_segment_count);
		docElement.append(segElement);
		$("#result_table").append(docElement);


	},
	searchOnError: function(xhr_data){
		mainController.popup("Erorr Occurs");
	},

};
	

