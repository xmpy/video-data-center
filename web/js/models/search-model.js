var mainModel = {
	BASE_URL : "http://127.0.0.1:8000/search/?query=ukbench00000",
	searchByColor : function(color_upbody, color_downbody, onSuccess){
		var url="http://localhost/webapps/VideoDataCenter/searchcolor.do";
		//console.debug(str_features);
		$.ajax({
			url: url,
			type: "post",
			dataType: "json",
			data:{
					up:color_upbody,
					down:color_downbody,
					},
			success: function(data){
				onSuccess(data);
			},
			error: function(){
			     alert("Error Occur!");
				//mainController.popup("Erorr Occurs");
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
