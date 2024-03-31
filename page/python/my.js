	//翻页加载作品
	var _laypage = layui.laypage;
	function loadPage(count, state) {
		_laypage.render({
			elem: 'layui_change_page'
			, count: count
			, limit: 8
			, theme: '#3593ff'
			, curr: 1
			, jump: function (obj, first) {
				$.ajax({
					'url': '/my/getPythonProjects',
					'type': 'POST',
					'data': { curr: obj.curr, limit: obj.limit, state: state },
					'success': function (d) {
						if (d.length) {
							$("#box_projects").html("");
							pythoninfo = d
							if (state == 0) {
								
								for (var i = 0; i < d.length; i++) {
									$("#box_projects").append(`
				
			
			
			
			<div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
					<mdui-card variant="outlined" clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
						<div class="card-main">
								<div class="substr card-main-text" >${d[i].title}</div>
								<div class="substr card-main-subtitle">${d[i].description}[${d[i].view_count}浏览]</div>
							</div>
						<div style="padding: 16px;">
							<mdui-button onclick="delProject(this,${d[i].id})">删除</mdui-button>	
							<mdui-button onclick="shareProject(${d[i].id})">分享</mdui-button>	
							<mdui-button onclick="SetProjectDescription(${i})">简介</mdui-button>	
							<mdui-button onclick='location.href=("/python/edit#${d[i].id}")'>编辑</mdui-button>
						</div>
					</mdui-card>
					</div>

			
			
			
			
			
			`);
								};
							} else {
								for (var i = 0; i < d.length; i++) {
									$("#box_projects").append(`<div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
					<mdui-card variant="outlined" clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
						<div class="card-main">
								<div class="substr card-main-text" >${d[i].title}</div>
								<div class="substr card-main-subtitle">${d[i].description}[${d[i].view_count}浏览]</div>
							</div>
						<div style="padding: 16px;">
							<mdui-button onclick="delProject(this,${d[i].id})">删除</mdui-button>	
							<mdui-button onclick="noshareProject(${d[i].id})">取消分享</mdui-button>	
							<mdui-button onclick="SetProjectDescription(${i})">简介</mdui-button>	
							<mdui-button onclick='location.href=("/python/edit#${d[i].id}")'>编辑</mdui-button>
						</div>
					</mdui-card>
					</div>
			
			`);
								}
							}
						} else {
							$("#box_projects").append(`<mdui-button href='/python/edit'>创建作品</mdui-button>`);
						}
					}
				});
			}
		});
	}

	//未分享的作品
	function project_state0() {
		$("#box_projects").html("");
		loadPage(state0_count, 0);
	}
	//已分享的作品
	function project_state1() {
		$("#box_projects").html("");
		loadPage(state1_count, 1);
	}
	//已开源的作品
	function project_state2() {
		$("#box_projects").html("");
		loadPage(state2_count, 2);
	}
    $(function () {
        project_state0();
      });
	//分享作品
	function shareProject(id) {
		mdui.confirm({
			headline: "确认分享作品?",
			description: "请确认操作",
			confirmText: "确认",
			cancelText: "取消",
			onConfirm: () =>
				AjaxFn('/my/python/share', { 'id': id }, function (res) {
					automsg(res['msg']);
					if ('success' == res['status']) {
						window.location.reload();
					}
				}),
			
		});

	};
	function noshareProject(id) {
		mdui.confirm({
			headline: "确认取消分享作品?",
			description: "请确认操作",
			confirmText: "确认",
			cancelText: "取消",
			onConfirm: () =>
				AjaxFn('/my/python/noshare', { 'id': id }, function (res) {
					automsg(res['msg']);
					if ('success' == res['status']) {
						window.location.reload();
					}
				}),
			
		});
	};

	function SetProjectDescription(id) {
		mdui.prompt({
      headline: "简介",
      description: "请输入简介",
      confirmText: "确认",
      cancelText: "取消",
	  textFieldOptions:{value: pythoninfo[id].description || 'null',autosize : '1',maxlength: "1000" ,counter : '1'},
      onConfirm: (value) => AjaxFn('/my/python/setdescription', { 'id': pythoninfo[id].id, description: value }, function (res) {
					automsg(res['msg']);
					if ('success' == res['status']) {
						window.location.reload();
					}
				}),
      onCancel: () => console.log("canceled"),
    });
		
	};
	//删除作品
	function delProject(that, id) {
		mdui.confirm({
			headline: "确认删除作品?",
			description: "请确认操作",
			confirmText: "确认",
			cancelText: "取消",
			onConfirm: () =>
				AjaxFn('/my/python/del', { 'id': id }, function (res) {
					automsg(res['msg']);
					if ('success' == res['status']) {
						window.location.reload();
					}
				}),
			
		});
	};