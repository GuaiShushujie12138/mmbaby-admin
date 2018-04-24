/**
 * Created by lianshang on 17/5/4.
 *
 *
 *
 *
 *
 */

(function (win) {
    // Chinese (China) (zh_CN)
    plupload.addI18n({
        "Stop Upload": "停止上传",
        "Upload URL might be wrong or doesn't exist.": "上传的URL可能是错误的或不存在。",
        "tb": "tb",
        "Size": "大小",
        "Close": "关闭",
        "You must specify either browse_button or drop_element.": "您必须指定 browse_button 或者 drop_element。",
        "Init error.": "初始化错误。",
        "Add files to the upload queue and click the start button.": "将文件添加到上传队列，然后点击”开始上传“按钮。",
        "List": "列表",
        "Filename": "文件名",
        "%s specified, but cannot be found.": "%s 已指定，但是没有找到。",
        "Image format either wrong or not supported.": "图片格式错误或者不支持。",
        "Status": "状态",
        "HTTP Error.": "上传出现网络异常。",
        "Start Upload": "开始上传",
        "Error: File too large:": "错误: 文件太大:",
        "kb": "kb",
        "Duplicate file error.": "重复文件错误。",
        "File size error.": "文件大小错误。(文件大小不超过8MB)",
        "N/A": "N/A",
        "gb": "gb",
        "Error: Invalid file extension:": "错误：无效的文件扩展名:",
        "Select files": "选择文件",
        "%s already present in the queue.": "%s 已经在当前队列里。",
        "Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.": "超限。<b>%s</b> 支持最大 %wx%hpx 的图片。",
        "File: %s": "文件: %s",
        "b": "b",
        "Uploaded %d/%d files": "已上传 %d/%d 个文件",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "每次只接受同时上传 %d 个文件，多余的文件将会被删除。",
        "%d files queued": "%d 个文件加入到队列",
        "File: %s, size: %d, max file size: %d": "文件: %s, 大小: %d, 最大文件大小: %d",
        "Thumbnails": "缩略图",
        "Drag files here.": "把文件拖到这里。",
        "Runtime ran out of available memory.": "运行时已消耗所有可用内存。",
        "File count error.": "文件数量错误。",
        "File extension error.": "文件扩展名错误。",
        "mb": "mb",
        "Add Files": "增加文件"
    });

    var FLASHURL = 'js/plugins/plupload/Moxie.swf';
    var XAPURL = 'js/plugins/plupload/Moxie.xap';

    function newOssUpload(element,callback,category) {
        var $uploader = $(element);
        var uploader = $uploader.data('__uploader');
        var multiple = $uploader.data('multiple');
        if (!uploader) {
            var options = {
                runtimes: 'html5,flash,html4',
                browse_button: element,
                url: '/upload/do-upload-ajax',
                flash_swf_url: FLASHURL,
                multi_selection: true,
                file_data_name: 'file',
                filters: {
                    mime_types: [
                        {
                            title: '图片',
                            extensions: 'jpg,jpeg,png,bmp,gif'
                        }
                    ],
                    // max_file_size: 8400000
                }
            };
            uploader = new plupload.Uploader(options);
            uploader.init();
            //由于这里采用立即上传方式，在队列添加文件后，理解上传
            uploader.bind('FilesAdded', onGetAliOssAndUpload);
            //文件上传前
            uploader.bind('BeforeUpload', beforeUpload);
            //单个文件上传完成
            uploader.bind('FileUploaded', onFileUploaded);
            //监听文件上传完毕事件
            uploader.bind('UploadComplete', onFileUploadComplete);
            //监听文件上传完毕事件
            uploader.bind('Error', onFileUploadError);
        }
        function onGetAliOssAndUpload(uploader, files) {
            category = category || 'generic';
            $.ajax({
                'url': '/image/token?category=' + category,
                'type': 'get',
                'success': function (data) {
                    if (data.code == 200) {
                        uploader.aliOss = data.data;
                        uploader.uploadedFiles = [];
                        //开始上传
                        uploader.start();
                    } else {
                        alert(data.message);
                    }
                }
            });
        }
        function beforeUpload(uploader, file) {
            var aliOss = uploader.aliOss;
            var name = new Date().getTime() + '_' + (10000 * Math.random()).toFixed(0) + "." + file.name.split('.')[1];
            var data = {};
            data.key = aliOss.dir + name;
            data.policy = aliOss.policy;
            data.OSSAccessKeyId = aliOss.accessid;
            data.signature = aliOss.signature;
            data.success_action_status = 201;
            file.accessUri = aliOss.path + data.key;
            uploader.setOption('url', 'https:' + aliOss.host);
            //设置上传参数
            uploader.setOption('multipart_params', data);
            //设置上传参数
            uploader.setOption('params', data);
        }

        function onFileUploaded(uploader, file, responseObject) {
            var uploadedFiles = uploader.uploadedFiles;
            var reponse = responseObject.response || "";
            if ((responseObject.status == 201 || responseObject.status == 200) && reponse.indexOf("PostResponse") > -1) {
                uploadedFiles.push(file.accessUri);
            }
        }

        function onFileUploadComplete(uploader, files) {
            var uploadedFiles = uploader.uploadedFiles;
            var result = uploadedFiles[0];
            callback&&callback(uploadedFiles);
        }
        function onFileUploadError(uploader, error) {
            alert(error.message || '上传出现异常!');
        }
    }
    win.newOssUpload = newOssUpload;
})(window);





