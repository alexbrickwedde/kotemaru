

function Canvas(){this.initialize.apply(this, arguments)};
(function(_class){
	var canvas;
	var context2d;
	var items = {};
	var selectItems = [];
	
	_class.init = function(elem) {
		canvas = elem;
		context2d = canvas.getContext('2d');
	}
	_class.reset = function() {
		items = {};
		selectItems = [];
	}
	_class.addItem = function(item) {
		if (items[item.internalId]) {
			throw "Confrict";
		}
		items[item.internalId] = item;
	}
	_class.delItem = function(item) {
		delete items[item.internalId];
	}
	_class.getItem = function(ex,ey, ignore) {
		for (var i in items) {
			if (items[i] != ignore && items[i].onPoint(ex, ey)) {
				return items[i];
			}
		}
		return null;
	}
	_class.getItems = function() {
		return items;
	}
	
	_class.refresh = function() {
		context2d.clearRect(0,0,1000,1000);
		var drawer = new Drawer(context2d);
		for (var i in items) {
			drawer.beginItem(items[i]);
			items[i].draw(drawer);
			drawer.endItem(items[i]);
		}
		for (var i=0; i<selectItems.length; i++) {
			selectItems[i].drawHandle(context2d);
		}
		drawer.close();
	}
	
	_class.toSVG = function() {
		var drawer = new DrawerSVG(context2d);
		for (var i in items) {
			drawer.beginItem(items[i]);
			items[i].draw(drawer);
			drawer.endItem(items[i]);
		}
		drawer.close();
		return drawer.getSVG();
	}
	
	_class.select = function(item) {
		selectItems.length = 0;
		_class.addSelect(item)
	}
	_class.addSelect = function(item) {
		if (item) selectItems.push(item);
	}
	_class.delSelect = function(item) {
		var idx = selectItems.indexOf(item);
		if (idx < 0) return;
		selectItems.splice(idx,1);
	}
	
	
	_class.getHandle = function(ex,ey) {
		for (var i=selectItems.length-1; i>=0; i--) {
			var handle = selectItems[i].getHandle(ex, ey);
			if (handle) return handle;
		}
		return null;
	}
	
	_class.cursor = function(type) {
		canvas.style.cursor = "url(img/cursor_"+type+".png),default";
	}

	//--------------------------------------------------------------------
	// Canvas ハンドラ設定。
	function onMouseDown(ev) {
		var action = Commands.getAction();
		if(event.which == 1) {
			action.onMouseDown(ev);
		} else if(event.which == 3) {
			action.openMenu(ev);
		}
	}
	function onMouseMove(ev) {
		var action = Commands.getAction();
		if(event.which == 1) {
			action.onMouseMove(ev);
		}
	}
	function onMouseUp(ev) {
		var action = Commands.getAction();
		if(event.which == 1) {
			action.onMouseUp(ev);
		}
	}
	function onDblClick(ev) {
		var action = Commands.getAction();
		if(event.which == 1) {
			action.onDblClick(ev);
		}
	}
	
	$(function(){
		var $can = $("canvas");
		_class.init($can[0]);
		
		$can.bind("mousedown",onMouseDown);
		$can.bind("mousemove",onMouseMove);
		$can.bind("mouseup",onMouseUp);
		$can.bind("dblclick",onDblClick);
		
		$(document).bind("contextmenu",function(){return false;});
	})
	
	
})(Canvas);


//EOF
