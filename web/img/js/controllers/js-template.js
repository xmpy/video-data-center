$(function() {$("#HDFS_list").jstree({	 "plugins" : [            "themes","json_data","ui","crrm","dnd","search","types","contextmenu"        ],  "json_data"   : {  	/*  	"ajax":{  		"url":"test_dir.json",  	}  	*/		"ajax" : {			"type": "POST",			// the URL to fetch the data			"url" : "hdfsfilelist.do",			// the `data` function is executed in the instance's scope			// the parameter is the node being loaded 			// (may be -1, 0, or undefined when loading the root nodes)			/*			"data" : function (n) { 				// the result is fed to the AJAX request `data` option				return { 					"operation" : "get_children", 					"id" : n.attr ? n.attr("id").replace("node_","") : 1 				}; 			}			*/			"data":function (n) { 				return {					"path":n.attr?n.attr("id"):"/user/zhaoxm"				};			} 		}  },		"types" : {			// I set both options to -2, as I do not need depth and children count checking			// Those two checks may slow jstree a lot, so use only when needed			"max_depth" : -2,			"max_children" : -2,			// I want only `drive` nodes to be root nodes 			// This will prevent moving or creating any other type as a root node			"valid_children" : [ "drive" ],			"types" : {				// The default type				"default" : {					// I want this type to have no children (so only leaf nodes)					// In my case - those are files					"valid_children" : "none",					// If we specify an icon for the default type it WILL OVERRIDE the theme icons					"icon" : {						"image" : "img/file.png"					}				},				// The `folder` type				"folder" : {					// can have files and other folders inside of it, but NOT `drive` nodes					"valid_children" : [ "default", "folder" ],					"icon" : {						"image" : "img/folder.png"					}				},				// The `drive` nodes 				"drive" : {					// can have files and folders inside, but NOT other `drive` nodes					"valid_children" : [ "default", "folder" ],					"icon" : {						"image" : "img/root.png"					},					// those prevent the functions with the same name to be used on `drive` nodes					// internally the `before` event is used					"start_drag" : false,					"move_node" : false,					"delete_node" : false,					"remove" : false				}			}		},		"core" : { 			// just open those two nodes up			// as this is an AJAX enabled tree, both will be downloaded from the server			"initially_open" : [ "/user/zhaoxm" ] 		},});});var mainController = {	currentPage: 1,	countPerPage: 20,	hsb_upbody:{h:300, s:0, b:94},	hsb_downbody:{h:300, s:0, b:94},	now_upbody:null,	now_upbody_hex:null,	now_downbody:null,	now_downbody_hex:null,	img_uploaded:null,	data: null,	data_filtered:null,	data_ori:null,		filterByColor : function(){	//console.log(val.up_color);				//console.log(mainController.now_upbody);				mainController.data = $.grep(mainController.data_ori, function(val, key){			if((val.up_color==mainController.now_upbody || mainController.now_upbody == null) && (val.down_color==mainController.now_downbody || mainController.now_downbody == null))			{				return true;			}			else{				console.log(val.up_color);				console.log(mainController.now_upbody);				return false;			}		});		console.log(mainController.data);		mainController.searchOnSuccess(mainController.data);	},		_init : function(){		console.log("hello word");				$("#result_area").hide();					$(document).ready(function () {		// if user clicked on button, the overlay layer or the dialogbox, close the dialog			$('a.btn-ok, #dialog-overlay, #dialog-box').click(function () {					$('#dialog-overlay, #dialog-box').hide();					return false;		});			// if user resize the window, call the same function again		// to make sure the overlay fills the screen and dialogbox aligned to center			$(window).resize(function () {					//only do it if the dialog box is not hidden			if (!$('#dialog-box').is(':hidden')) mainController.popup();				});			});						var widt = false;			$('ul.color-chips.upbody li a').click(function(e){				console.log(e.target);				console.log(e.target["title"])				$('ul.color-chips.upbody li').removeClass("current");				$(this).parent().addClass("current");				mainController.now_upbody = e.target["title"];				mainController.filterByColor();			});			$('ul.color-chips.downbody li a').click(function(e){				console.log(e.target);				console.log(e.target["title"])				$('ul.color-chips.downbody li').removeClass("current");				$(this).parent().addClass("current");				mainController.now_downbody = e.target["title"];				mainController.filterByColor();			});								$("#search_button").click(mainController.handleSearch);			$("#search_button_color").click(mainController.handleSearchColor);			/*			$.post('yourAction',{'orgid':""},function(data){                  				if(typeof JSON == 'undefined'){                                                     				$('head').append($("<script type='text/javascript' src='jquery/json2.js'>"));				}});                                                			*/			//$("#upload_button").click(mainController.handleUpload);	},	handleSearch:function()	{		mainController.now_upbody = null;		mainController.now_downbody = null;		//mainController.showResultTable();		$("#search2").hide();		mainController.data = [{"video_filename":"1.avi","img_filename":"15.png","start_frame":"123","up_color":"GRAY","down_color":"GRAY"},{"video_filename":"2.avi","img_filename":"23.png","start_frame":"123","up_color":"GRAY","down_color":"WHITE"},{"video_filename":"2.avi","img_filename":"12.png","start_frame":"123","up_color":"BLACK","down_color":"GRAY"}]; 		mainController.data_ori = mainController.data;		mainController.searchOnSuccess(mainController.data);	},		handleSearchColor:function()	{		$("#search1").hide();		//mainController.now_upbody = null;		//mainController.now_downbody = null;				//mapping the chose colors to 16 basic colors		console.log(mainController.hsb_upbody);		//var color_upbody = mainController.mapColor(mainController.hsb_upbody);		//var color_downbody = mainController.mapColor(mainController.hsb_downbody);		//mainModel.feedback(color_upbody, color_downbody,"a","b","c","s");		mainModel.searchByColor(mainController.now_upbody, mainController.now_downbody, mainController.searchByColorSuccess)	},		handleUpload:function(data_received)	{		mainController.now_upbody = null;		mainController.now_downbody = null;		//console.log("hello");		$("#search2").hide();		console.log(data_received);		console.log(JSON.stringify(data_received));		console.log(data_received.result);		mainController.data = data_received.result;		mainController.data_ori = mainController.data;		mainController.img_uploaded = data_received.img;		//mainController.countPerPage = mainController.data.length;		console.log(mainController.countPerPage);		mainController.searchOnSuccess(data_received.result);		//mainModel.upload(mainController.searchFirstOnSuccess, mainController.searchOnError);			},	mapColor:function(hsb){		var h = hsb.h + 30;		var temp_h = Math.floor(h/60);		console.log(hsb)		if(hsb.s > 50 && hsb.b >50){			switch(temp_h)			{				case 0:					return "RED";				case 1:					return "YELLOW";				case 2:					return "GREEN";				case 3:					return "CYAN";				case 4:					return "BLUE";				case 5:					return "FUCHSIN";			}		}		else if(hsb.s > 50 && hsb.b <50){			switch(temp_h)			{				case 0:					return "MAROON";				case 1:					return "OLIVE";				case 2:					return "DGREEN";				case 3:					return "TEAL";				case 4:					return "DBLUE";				case 5:					return "PURPLE";			}		}		else if(hsb.s < 50 && hsb.b <50){			if(hsb.b < 25){				return "BLACK";			}			else{				return "GRAY";			}		}		else{			if(hsb.b > 75){				return "WHITE";			}			else{				return "SILVER";			}		}	},	searchByColorSuccess: function(data){			mainController.data = data.result;			mainController.showResultTable();			$("#choose_attr_table").hide();			mainController.currentPage=1;			mainController.showPage();			mainController.showResult();			//$("#choose_attr_table").hide();	},		searchOnSuccess: function(data){		//console.log(typeof(data));		//mainController.data_received = data;		//mainController.copyData((mainController.currentPage-1)*mainController.countPerPage,mainController.countPerPage);		//mainController.page_cached[mainController.currentPage-1] = 1;		mainController.showResultTable();		$("#img_uploaded").attr("src","upload/"+mainController.img_uploaded)		mainController.currentPage=1;		mainController.showPage();		mainController.showResult();	},	showResultTable: function(){		$("#result_area").show();		$('#search_input_area').removeClass("search_page");		$('#search_input_area').addClass("result_page_search");			$('#search_input_area').removeAttr("text-align");		$('#search2_form').css("margin-left","0%");		$('#logo').removeAttr("text-align");		$('#logo').removeClass("logo");		$("#logo").addClass("logo_result");		$("#search_input_combo").addClass("result_page_search_combo");		if(mainController.now_upbody != null){			console.log(mainController.now_upbody);			console.log(mainController.now_upbody_hex);		     $('#colorselector_filter1 div').css('backgroundColor', '#' + mainController.now_upbody_hex);		}		if(mainController.now_downbody != null){			//console.log(mainController.now_upbody);			//console.log(mainController.now_upbody_hex);		     $('#colorselector_filter2 div').css('backgroundColor', '#' + mainController.now_downbody_hex);		}			},		showResult: function(){		$(".search_result_item").remove();		/*		var index = (mainController.currentPage - 1) * mainController.countPerPage;		var end = mainController.currentPage * mainController.countPerPage - 1;		if(end > mainController.data.length -1){			end = mainController.data.length -1;		}		var n = Math.ceil(mainController.data.length / mainController.countPerRow);		var i = 0;		var j =0;		console.log(i*n);		*/		mainController.countPerPage = mainController.data.length;		console.log(mainController.countPerPage);		for(i = 0 ;i < mainController.countPerPage; i++){		/*			for(j = 0; j< mainController.countPerRow; j++){				console.log(mainController.dataPerRow)				mainController.dataPerRow[j] = mainController.data[i*mainController.countPerRow +j];			}		*/			mainController.showRecord(i);		}	},	showRecord: function(index){		//console.log(mainController.data);		//console.log(mainController.data[0]);		//console.log(index);		var docElement = $("<tr>");		docElement.addClass("search_result_item");		var idElement = $("<td>");		idElement.text(index);		docElement.append(idElement);		var imgElement = $("<td>");		//var aElement = $('<a href="jwplayer/jwplayer.flash.swf?file=myVideo.mp4&autostart=true" class="online_video_a">');//imgElement.html('<img class="img-polaroid" src="'+'upload/1.png'+'" height=150 width=150/>');			imgElement.html('<img class="img-polaroid" src="'+mainController.data[index].img_filename+'" style="height:200px;width:160px;" />');					//imgElement.append(aElement);		docElement.append(imgElement);		var descElement = $("<td>");		descElement.html("图片路径："+mainController.data[index].img_filename+"<br\>视频路径："+mainController.data[index].video_filename+"<br\>出现帧数："+mainController.data[index].start_frame+"<br\>上半身衣服颜色："+mainController.data[index].up_color+"<br\>下半身衣服颜色："+mainController.data[index].down_color);		docElement.append(descElement);		docElement.addClass("search_result");        jQuery("img.img-polaroid").fancybox({          //'content':'<div class="media">Test</div>',			'content':'<a class="media" href="'+mainController.data[index].video_filename+'">My avi video</a>',            maxWidth    : 800,            maxHeight   : 600,            fitToView   : false,            width       : 750,            height      :450,            autoSize    : false,            closeClick  : false,            openEffect  : 'none',            closeEffect : 'none',			closeBtn : true,            afterShow: function() {			/*			$('.media').media({				width: 400,				height: 700,				autoplay: true,				src: 'upload/test2.avi',				attrs: { attr1: 'attrValue1', attr2: 'attrValue2' }, // object/embed attrs				params: { param1: 'paramValue1', param2: 'paramValue2' }, // object params/embed attrs				caption: false // supress caption text			});			*/			$('.media').media({				width:700,				height:400,				autoplay: true,				params: {CurrentPosition: '100', autostart:"1"},			});			/*                jwplayer('mediaspace').setup({                    'flashplayer': 'jwplayer/jwplayer.flash.swf',                                'file': 'upload/myVideo.mp4',                     'image': 'upload/1.png',                    'provider': 'youtube',                    'height': 400,                    'width': 700,                    'controlbar.position': 'bottom',                    'youtube.quality': 'highres'                });          */		  		  }        });		if(index % 2 === 0){			docElement.addClass("grey_row");		}				$("#result_table").append(docElement);	},	showPage: function(){		$("#current_page").val(mainController.currentPage);		if(mainController.currentPage == 1){			$("#previous_page").addClass("disabled");		} else {			$("#previous_page").removeClass("disabled");		};		if(mainController.currentPage == mainController.totalPage){			$("#next_page").addClass("disabled");		} else {			$("#next_page").removeClass("disabled");		};	},		searchOnError: function(xhr_data){		mainController.popup("Erorr Occurs");	},			popup: function(message) {		console.log(message);	// get the screen height and width  	var maskHeight = $(document).height();  	var maskWidth = $(window).width();	var windowHeight = $(window).height();		console.log(maskHeight);	console.log(windowHeight);		// calculate the values for center alignment	var dialogTop =  (windowHeight/2)- ($('#dialog-box').height())/2;  	var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2); 		// assign values to the overlay and dialog box	$('#dialog-overlay').css({height:maskHeight, width:maskWidth}).show();	$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	// display the message	$('#dialog-message').html(message);			},};