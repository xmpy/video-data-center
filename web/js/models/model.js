var mainModel = {
	BASE_URL : "http://192.168.1.106:8080/solr/select/",
	search : function(keyword, onSuccess, onErorr){
		var url;
		url = "sample_data.json";
		$.ajax({
			  type:"GET",
			  url: "sample_data.json",
			  dataType: 'json',
			  success: function(data) {
			    console.debug(data);
			    onSuccess(data);
			  },
			  
			  error: function(xhr_data,strError){
				console.debug(xhr_data);
				console.debug();
			  }
		});
	},
	runjob : function(filepath,format,code,bit,fps,hw,onSuccess){
		var url="http://10.103.241.118/webapps/VideoDataCenter/runjob.do";
		//console.debug(str_features);
		$.ajax({
			url: url,
			type: "post",
			dataType: "text",
			data:{
					filepath:filepath,
					format:format,
					code:code,
					bit:bit,
					fps:fps,
					hw:hw,
					},
			success: function(data){
				onSuccess(data);
			},
			error: function(xhr_data,strError){
			console.debug(xhr_data);
			console.debug();
			}		
			});
	},
    summaryrunjob : function(filepath,onSuccess){
        var url="http://10.103.241.118/webapps/VideoDataCenter/summaryrunjob.do";
        //console.debug(str_features);
        $.ajax({
            url: url,
            type: "post",
            dataType: "text",
            data:{
                    filepath:filepath,
                    },
            success: function(data){
                onSuccess(data);
            },
            error: function(xhr_data,strError){
            console.debug(xhr_data);
            console.debug();
            }       
            });
    },
    preprocessrunjob : function(filepath,onSuccess){
        var url="http://10.103.241.118/webapps/VideoDataCenter/preprocess.do";
        //console.debug(str_features);
        $.ajax({
            url: url,
            type: "post",
            dataType: "text",
            data:{
                    filepath:filepath,
                    },
            success: function(data){
                onSuccess(data);
            },
            error: function(xhr_data,strError){
            console.debug(xhr_data);
            console.debug();
            }       
            });
    },
	getClusterSummary: function(onSuccess){
		var url;
		url = "clustersummary.do";
		$.ajax({
			  type:"post",
			  url: url,
			  dataType: 'json',
			  success: function(data) {
			    console.debug(data);
			    onSuccess(data);
			  },
			  
			  error: function(xhr_data,strError){
				console.debug(xhr_data);
				console.debug();
				onErorr(xhr_data);
			  }
		});
	},
	upload : function(onSuccess, onErorr){
		var url;
		//url = "http://127.0.0.1:8000/search/?query="+encodeURIComponent(keyword);
		$('#search_button').fineUploader({
        debug: true,
//        cors: {
//            expected: true
//        },
        request: {
            endpoint: "/upload/receiver",
            paramsInBody: true
//            params: {
//                test: 'one',
//                blah: 'foo',
//                bar: {
//                    one: '1',
//                    two: '2',
//                    three: {
//                        foo: 'bar'
//                    }
//                },
//                fileNum: function() {
//                    fileNum+=1;
//                    return fileNum;
//                }
//            }
        },
        chunking: {
            enabled: true
        },
        resume: {
            enabled: true
        },
        retry: {
            enableAuto: true,
            showButton: true
        },
        deleteFile: {
            enabled: true,
            endpoint: '/upload/receiver',
            forceConfirm: true,
            params: {foo: "bar"}
        },
        display: {
            fileSizeOnSubmit: true
        },
        paste: {
            targetElement: $(document)
        }
    })
        .on('error', onErorr)
        .on('uploadChunk resume', function(event, id, fileName, chunkData) {
            qq.log('on' + event.type + ' -  ID: ' + id + ", FILENAME: " + fileName + ", PARTINDEX: " + chunkData.partIndex + ", STARTBYTE: " + chunkData.startByte + ", ENDBYTE: " + chunkData.endByte + ", PARTCOUNT: " + chunkData.totalParts);
        })
        .on("upload", function(event, id, filename) {
            $(this).fineUploader('setParams', {"hey": "ho"}, id);
        });
//        on("pasteReceived", function(event, blob) {
//            qq.log(blob);
//            return new qq.Promise().success();
//        });

	},
};
