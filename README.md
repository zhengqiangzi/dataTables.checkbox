# dataTables.checkbox
+ **示例**

``` var data=[]
for(var i=0;i<=100;i++){


	var obj={
		name:"name"+i,
		position:"position"+i,
		office:"office"+i,
		extn:"extn"+i,
		startDate:"date"+i,
		salary:"salary"+i
	}

	data.push(obj)

}         


$(document).ready(function(){

	var t=$("#example").DataTable({
        dom: "frtip",
        checkbox:{
			th:{
				style:"width:30px;text-align:left;"
			},
			data:[{"name":"name17","position":"position17","office":"office17","extn":"extn17","startDate":"date17","salary":"salary17"}]
        },
        data:data,
		columns:[
				{title:"name",data:"name",orderable:true},
				{title:"position",data:"position",orderable:false},
				{title:"office",data:"office",orderable:false},
				{title:"extn",data:"extn",orderable:false},
				{title:"startDate",data:"startDate",orderable:false},
				{title:"salary",data:"salary",orderable:false}
			],

	})



	t.checkbox.getData()[0]
	t.checkbox.setData([{"name":"name1","position":"position1","office":"office1","extn":"extn1","startDate":"date1","salary":"salary1"}])

})
```
### 实例方法

+ **获取已选的所有的数据**

	JSON.stringify(t.checkbox.getData()[0]

+ **获取已选的所有的数据**
	t.checkbox.setData([{"name":"name1","position":"position1","office":"office1","extn":"extn1","startDate":"date1","salary":"salary1"}])

### 配置
```	
let config={
  className:"dataTablesCheckbox",
  th:{
    style:"width:40px;text-align:left;"
  },
 data:[]
}

```
+ **配置 className**
 插件中th/td的class名称
 
 + **配置 th**
 插件中th的样式
 
 + **配置data**
 初始化时可以预先置入数据


