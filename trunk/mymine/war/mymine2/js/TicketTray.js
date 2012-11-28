
//@Singleton
function TicketTray(){this.initialize.apply(this, arguments)};
(function(Class){
	var _TICKET_TRAY = "#ticketTray";
	var _TICKET = "#ticketTray .ExTableRow";
	var TicketSelect = "TicketSelect";
	var _TicketSelect = "."+TicketSelect;

	
	var SETTERS = {
		id:			function($elem,issue) {
			$elem[0].dataset.num = issue.id;
			$elem.text(issue.id);
		},
		project:	function($elem,issue) {$elem.html(name(issue.project));},
		tracker:	function($elem,issue) {$elem.html(name(issue.tracker));},
		priority:	function($elem,issue) {$elem.html(name(issue.priority));},
		assigned_to:function($elem,issue) {$elem.html(name(issue.assigned_to));},
		subject:	function($elem,issue) {$elem.text(issue.subject);},
	
		start_date:	function($elem,issue) {$elem.html(toYYMMDD(issue.start_date));},
		due_date:	function($elem,issue) {$elem.html(toYYMMDD(issue.due_date));},
		updated_on:	function($elem,issue) {$elem.html(toYYMMDD(issue.updated_on));},

		done_ratio: function($elem,issue) {
			$elem.html("<div class='RateBar'><span></span></div>");
			$elem.find(">div>span").css("width",issue.done_ratio+"%");
		}
	};

	// カラムメタ情報
	var COLUMN_METAS =[
		{title:"番号",   	width:36, setter:SETTERS.id,
						style:{textAlign:"right"}},
		{title:"プロジェクト", width:80, setter:SETTERS.project },
		{title:"トラッカー",	width:70, setter:SETTERS.tracker },
		{title:"優先度", 		width:48, setter:SETTERS.priority },
		{title:"担当者", 		width:97, setter:SETTERS.assigned_to },
		{title:"更新日",		width:54, setter:SETTERS.updated_on },
		{title:"開始日", 		width:54, setter:SETTERS.start_date },
		{title:"期日", 		width:54, setter:SETTERS.due_date },
		{title:"進捗", 		width:28, setter:SETTERS.done_ratio },
		{title:"題名",   	width:"100%",  setter:SETTERS.subject,
						style:{whiteSpace:"normal", height:"auto"}}
	];

	var exTable = null;

	// 「進捗」表示用カスタムカラム関数
	function rateSetter($elem,data,index) {
		var val = data[index];
		$elem.html("<div class='RateBar'><span></span></div>");
		$elem.find(">div>span").css("width",val+"%");
	}


	function name(data){
		return data?data.name:"&nbsp;";
	}
	function to2ChStr(n) {
		if (n > 9) return ""+n;
		//return "&nbsp;"+n;
		return "0"+n;
	}
	function toYYMMDD(dateStr) {
		var time = Date.parse(dateStr);
		if (isNaN(time)) return "&nbsp;";
		var date = new Date(time);
		var text = (date.getFullYear()%100)
			+"/"+to2ChStr(date.getMonth()+1)
			+"/"+to2ChStr(date.getDate())
			+" "+to2ChStr(date.getHours())
			+":"+to2ChStr(date.getMinutes())
			+":"+to2ChStr(date.getSeconds())
		;
		return text
	}

	function toMMDD(dateStr) {
		var time = Date.parse(dateStr);
		if (isNaN(time)) return "&nbsp;";
		var date = new Date(time);
		return to2ChStr(date.getMonth()+1)+"/"+to2ChStr(date.getDate());
 	}
	

	Class.update = function() {
		Config.redmineApiPath = "/r-labs";
		new RedMine().getIssues(function(resData){
			var issues = resData.issues;
			var data = [];
			for (var i=0; i<issues.length; i++) {
				var issue = issues[i];
				data.push(issue);	
			}
			exTable.data(data);
		});
	}
	
	//---------------------------------------------------------------------
	// Event Handler
	
	var isDrag = false;

	Class.isDrag = function(b) {
		if (b !== undefined) isDrag = b;
		return isDrag;
	}

	Class.setDragCursor = function() {
		if (isDrag) {
			var sels = Class.getSelection();
			var img = (sels.length>=2) ? "tickets-no":"ticket-no";
			$(document.body).css("cursor","url(img/"+img+".png) 16 8, pointer");
		} else {
			$(document.body).css("cursor","default");
		}
	}

	Class.getSelection = function() {
		var selection = [];
		var tickets = $(_TicketSelect);
		for (var i=0; i<tickets.length; i++) {
			selection.push(tickets[i].dataset.num);
		}
		return selection;
	}
	Class.clearSelection = function() {
		$(_TicketSelect).removeClass(TicketSelect);
	}
	Class.addSelection = function(elem) {
		$(elem).addClass(TicketSelect);
	}

	function bindMove() {
		// Ticket
		var draggable = null;
		var downTime = 0;
		$(_TICKET).live("mousedown",function(ev){
			Class.isDrag(true);
			draggable = this;
			downTime = new Date().getTime();
			return false;
		}).live("mousemove",function(ev){
			var isClick = (200 > (new Date().getTime() - downTime));
			if (!isClick && draggable == this) {
				Class.setDragCursor();
				if (Class.isDrag()) {
					Class.addSelection(this);
				}
			}
		}).live("mouseout",function(ev){
			if (draggable == this) {
				draggable = null;
			}
		}).live("mouseup",function(ev){
			var isClick = (200 > (new Date().getTime() - downTime));
console.log("-->",isClick,ev.ctrlKey);
			if (isClick) {
				if (!ev.ctrlKey) Class.clearSelection();
				$(this).toggleClass(TicketSelect);
				draggable = null;
			}
		}).live("dblclick",function(ev){
			var num = this.dataset.ticketNum;
			RedMine.openIsuue(num);
			Ticket.checked(num);
			Class.refresh();
			Folder.refresh();
		});

		$(document.body).live("mouseup",function(ev){
			//Class.clearSelection();
			draggable = null;
			Class.isDrag(false);
			Class.setDragCursor();
		});
	}

	//----------------------------------------------------------------
	// 初期化
	$(function(){
		// テーブル生成
		exTable = new ExTable(_TICKET_TRAY);
		exTable.header(COLUMN_METAS).data([{}]);
		bindMove();
	})

	

})(TicketTray);
