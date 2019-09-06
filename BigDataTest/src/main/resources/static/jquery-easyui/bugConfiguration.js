$(function () {
    $('#attrtype').combobox({
        valueField:'id',
        textField:'text',
        data:[{
            "id":1,
            "text":"文本框"
        },{
            "id":2,
            "text":"下拉框"
        },{
            "id":3,
            "text":"日期框"
        },{
            "id":4,
            "text":"日期时间框"
        },{
            "id":5,
            "text":"人员选择框"
        }],
        onSelect:function () {
            var selectText = $("#attrtype").combobox('getText');
            if(selectText != '下拉框'){
                $('#queryTestTable').linkbutton('disable');
                $('#resetTestTable').linkbutton('disable');
            }
            else{
                $('#queryTestTable').linkbutton('enable');
                $('#resetTestTable').linkbutton('enable');
            }
        }
    });
    $("#attrTree").tree({
        url:"treeData",
        loadFilter: function(rows){
            return convert(rows);
        },
        onClick:function (node) {
            $.ajax({
                url: "allData",
                data:{propertyName: node.text},
                type: 'POST',
                dataType: 'text',
                async:false,//ajax设为同步以及时刷新
                success: function (data){
                    data='['+data+']';
                    data=eval(data);

                    $('#attrcode').val(data[0]["propertyCode"]);
                    $('#attrname').val(data[0]["propertyName"]);
                    $('#aliasname').val(data[0]["propertyAlias"]);
                    $('#attrtype').combobox('setText', data[0]["propertyType"]);
                    $('#attrlen').val(data[0]["fieldLength"]);
                    $('#colwidth').val(data[0]["showWidth"]);

                    $('#status').attr("checked",data[0]["enable"]);
                    $('#isnotnull').attr("checked",data[0]["required"]);
                    $('#ishistory').attr("checked",data[0]["record"]);
                    $('#isview').attr("checked",data[0]["view"]);
                    $('#ismulti').attr("checked",data[0]["multi"]);
                    $('#commentRequireOnChange').attr("checked",data[0]["commented"]);

                    $('#memo').val(data[0]["propertyExplain"]);
                    $('#sortno').val(data[0]["sortNum"]);
                    $('#defaultVal').val(data[0]["defaultValue"]);

                    if($('#attrtype').combobox('getText') != '下拉框'){
                        $('#queryTestTable').linkbutton('disable');
                        $('#resetTestTable').linkbutton('disable');
                    }
                    else{
                        $('#queryTestTable').linkbutton('enable');
                        $('#resetTestTable').linkbutton('enable');
                    }

                }
            })
        }
    });

});

function convert(rows){
    function exists(rows, parentId){
        for(var i=0; i<rows.length; i++){
            if (rows[i].name == parentId) return true;
        }
        return false;
    }

    var nodes = [];
    // get the top level nodes
    for(var i=0; i<rows.length; i++){
        var row = rows[i];
        if (!exists(rows, row.parentId)){
            nodes.push({
                id:row.name,
                text:row.name
            });
        }
    }

    var toDo = [];
    for(var i=0; i<nodes.length; i++){
        toDo.push(nodes[i]);
    }
    while(toDo.length){
        var node = toDo.shift();	// the parent node
        // get the children nodes
        for(var i=0; i<rows.length; i++){
            var row = rows[i];
            if (row.parentId == node.text){
                var child = {id:row.name,text:row.name};
                if (node.children){
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                toDo.push(child);
            }
        }
    }
    return nodes;
}

function save_addOrUpdateSysAttr() {

    var dataReturn = {
        propertyCode:$('#attrcode').val(),
        propertyName:$('#attrname').val(),
        propertyAlias:$('#aliasname').val(),
        propertyType:$('#attrtype').combobox('getText'),
        fieldLength:$('#attrlen').val(),
        showWidth:$('#colwidth').val(),

        enable:$('#status').is(':checked'),
        required:$('#isnotnull').is(':checked'),
        record:$('#ishistory').is(':checked'),
        view:$('#isview').is(':checked'),
        multi:$('#ismulti').is(':checked'),
        commented:$('#commentRequireOnChange').is(':checked'),

        propertyExplain:$('#memo').val(),
        sortNum:$('#sortno').val(),
        defaultValue:$('#defaultVal').val()
    }

    $.ajax({
        url:'save',
        data:{"data": JSON.stringify(dataReturn)},
        type: 'POST',
        dataType: 'JSON',
        success:function (result) {
            $.messager.alert('提示','保存成功!','info');
        }
    })
}

function queryTestTable() {
    var content = '<iframe src="' + "comboGrid/"+$('#attrcode').val() + '" width="100%" height="99%" frameborder="0" scrolling="no"></iframe>';
    $('#dd_tt').dialog({
        content:content,
        width: 400,
        height: 430,
        title: "数据字典列表",
        modal: true
    });



}
