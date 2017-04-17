var DataTable = $.fn.dataTable;
require("lodash");
require("./index.css")
class DataTablesCheckbox{
	constructor(dt,opts) {
		this._defaultConfig={

			className:"dataTablesCheckbox",
			th:{
				style:"width:40px;text-align:left;"
			},
			data:[],
			changeCallBack:function(status,data){
				//this 指向所触发的dom
			}
		}	
		this.config=Object.assign({},this._defaultConfig,opts.checkbox);//合并内部与外部配置

		this.dt=new DataTable.Api( dt );//实例 api

		this.dt.settings()[0].checkbox=this;//把当前实例对到配置参数上

		this.opts=opts;//配置参数

		this.selectedData=this.config.data||[];//数据源

		var _self=this;

		//draw header时监听
		this.dt.context[0].aoHeaderCallback.push({

			fn:function(tr,allData){

				var a=$(tr).find("."+_self.config.className)
				if(a.length>0){
					a.unbind();
					a.remove();
				}
				var th=$(`<th class='${_self.config.className} dataTablesCheckbox' style="${_self.config.th.style}"><input type='checkbox'/></th>`);
   				th.prependTo(tr);
   				th.change(function(){

   						var status=$($(this).find("input[type='checkbox']")).prop("checked");

   						_self.dt.rows(":visible")[0].map(function(index,indexs){

	   						var checkbox=$(_self.dt.row(index).node()).find("input[type='checkbox']");

   							checkbox.prop("checked",status);

   							checkbox.trigger("change")
   						})
   				})

   				_self.checkSelectAllInOnePage();
			}
		})
			//draw tr 监听
   		 this.dt.context[0].aoRowCallback.push({

   		 	fn:function(row,data,index,indexs){

   		 		var hasIn=_self.hasInSelectedData(data);

   		 		var a=$(row).find("."+_self.config.className);
   		 			if(a.length>0){
   		 				a.unbind();
   		 				a.remove();
   		 			}
   		 		var rowNode=_self.dt.row(row).node();

   		 		var obj=$(`<td class='dataTablesCheckbox ${_self.config.className}'><input type='checkbox'/></td>`);

   		 		if(hasIn){

   		 			obj.prependTo(rowNode);
   		 			obj.find("input[type='checkbox']").prop("checked",true);

   		 			//执行回调函数
 	  		 		_self.config.changeCallBack.bind(obj.find("input[type='checkbox']"),hasIn,data)()

   		 		}else{

   		 			obj.prependTo(rowNode);
   		 			obj.find("input[type='checkbox']").prop("checked",false);
   		 		}

   		 		obj.find("input[type='checkbox']").change(function(){

   		 			var status=$(this).prop("checked");

   		 			if(status){

   		 				_self.addDataToSelectedData(data);

   		 			}else{

   		 				_self.subtractionDataFromSelectedData(data);
   		 			}

   		 			_self.checkSelectAllInOnePage();

   		 			//执行回调函数
 	  		 		_self.config.changeCallBack.bind($(this),status,data)()

   		 		});



   		 	}
   		 })
	}


	/**
		@name hasInSelectedData
		@desc 查询数据是否在selectedData数据源中
		@parma data:查询 数据
		@return Boolean;
	*/


	hasInSelectedData(data){

		return !!~_.findIndex(this.selectedData,data) || _.indexOf(this.selectedData,data)>=0?true:false;
	}
	/**
		@name getIndexInSelectedSource
		@desc 查询数据在selectedData数据源的位置
		@parma data:查询数据
		@return Number;
	*/
	getIndexInSelectedSource(data){

		var i=_.findIndex(this.selectedData,data);
		var j=_.indexOf(this.selectedData,data);

		if(i<0){

			return j;

		}else{

			return i;
		}
	}


	/**
		@name addDataToSelectedData
		@desc 添加参数data到已选数据中
		@parma data:已选数据
		@return Boolean;
	*/

	addDataToSelectedData(data){

		if(this.hasInSelectedData(data)){

			console.log('already in ');

			return false;

		}else{

			this.selectedData.push(data)

			return true;
		}
	}
	/**
		@desc:从已选的数据源中删除对应项
		@name:subtractionDataFromSelectedData
		@param 
			data 需要删除的数据
		@return Boolean;

		*/
	subtractionDataFromSelectedData(data){

		var delindex=this.getIndexInSelectedSource(data);
		if(delindex>=0){

			this.selectedData.splice(delindex,1)
		}else{

			console.log('no data in source');
		}
	}

	/**
		@name checkSelectAllInOnePage
		@return null
		@desc 检测当前页面中的数据是否全选，影响header上面的checkbox是否选择
	*/
	checkSelectAllInOnePage(){

		var _self=this;

		setTimeout(function(){
			var data=_self.dt.rows(":visible")[0];
			var cond=[]
			data.map(function(index,items){
				var checkbox=_self.hasInSelectedData(_self.dt.row(index).data());
				cond.push(checkbox);
			})

			var isSelectAll= _.compact(cond).length==data.length && cond.length>0;
			var checkbox=$(_self.dt.table().header()).find(`.${_self.config.className}>input[type='checkbox']`);
			if(isSelectAll){
				checkbox.prop("checked",true);
			}else{
				checkbox.prop("checked",false);
			}
		})
	}

}
/**
	@name checkbox.getData
	@desc 实例扩展方法getData,提供程序运行时获取数据源
	@return Array

*/
DataTable.Api.register( 'checkbox.getData()', function ( opts ) {
	return this.iterator( 'table', function (ctx) {
		return ctx.checkbox.selectedData;

	});
});

/**
	@name checkbox.setData
	@desc 实例扩展方法setData,提供程序运行时设置数据源
	@return null

*/
DataTable.Api.register( 'checkbox.setData()', function ( opts ) {
	return this.iterator( 'table', function (ctx) {
		ctx.checkbox.selectedData=opts;
		ctx.checkbox.dt.draw();
	});
});


$(document).on( 'preInit.dt.dtk', function (e, settings, json) {
	if(settings.oInit.checkbox){
		new DataTablesCheckbox(settings,settings.oInit);
	}
})