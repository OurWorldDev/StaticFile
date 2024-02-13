var _work_changed = false;
var editor = CodeMirror.fromTextArea($("#code_textarea")[0], {
  //script_once_code为你的textarea的ID号
  lineNumbers: true, //是否显示行号
  mode: "shell", //默认脚本编码
  lineWrapping: true, //是否强制换行
});

editor.on("keypress", function () {
  editor.showHint(); //显示智能提示
  if (!_work_changed) {
    _work_changed = true;
    $("#save_work_box").show();
  }
});
editor.setOption("theme", "solarized dark");
editor.setOption("mode", "python");
editor.setValue($("#code_textarea").val());
window.CodeMirror = CodeMirror;

function getQueryString(name) {
  const url_string = window.location.href
  const url = new URL(url_string);
  return url.searchParams.get(name);
}
//动态获取作品
function getWork() {
  AjaxFn("/python/getWork", { id: getQueryString('id') }, function (r) {
    if ("ok" == r.status) {
      show_python_work(r.work);
    } else {
      automsg(r.msg);
    }
  });
}
!(function () {
  getWork(); //主动执行一次
})();

var _work_id = 0;
var _work_state = 0;
var _work_title = "";

function show_python_userinfo(work) {
  console.log(work);
  document.querySelector('#authorinfo').setAttribute('headline', work.nickname);
  document.querySelector('#authorinfo').setAttribute('description',work.motto);
  document.querySelector('#authorinfo').setAttribute('href','/user?id=' + work.id);
  document.querySelector('#authoravatar').setAttribute('src', `/api/usertx?id=${work.id}`);
  
}
//用一个作品数据初始化界面
function show_python_work(work) {
  if (_work_changed) {
    layer.confirm(
      "作品有更新，是否放弃保存作品？",
      { title: "重要提示", shadeClose: true },
      function (index) {
        _work_changed = false;
        $("#save_work_box").hide();

        show_python_work(work);
        layer.close(index);
      }
    );

    return;
  }
  //清除各类状态
  run_clear(); //清除运行结果
  window.location.hash = work.id;
  document.getElementById("work_title").innerHTML = work.title;
  document.getElementById("work_update").innerHTML = `最后更新:${work.time}`;
  console.log(work);
  if (work.state=='0'){
    document.querySelector('#projectstate').setAttribute('icon', 'lock_person');
    document.querySelector('#projectstate').innerHTML='未分享'

  }
  else if (work.state=='1'){
    document.querySelector('#projectstate').setAttribute('icon', 'share');
    document.querySelector('#projectstate').innerHTML='公开作品'

  }
  
  else if (work.state=='2'){
    document.querySelector('#projectstate').setAttribute('icon', 'star');
    document.querySelector('#projectstate').innerHTML='优秀作品'

  }
  AjaxFn(
    `/api/getuserinfo?id=${work.authorid}`,
    { id: work.authorid },
    function (r) {
      if ("ok" == r.status) {
        show_python_userinfo(r.info);
      } else {
        automsg(r.msg);
      }
    }
  );
  window.editor.setValue(work.src); //设置作品源代码

  _work_id = work.id;
  _work_state = work.state;
  _work_title = work.title;
}

// 运行部分
function outf(H) {
  var t = document.getElementById("output");
  t.innerHTML = t.innerHTML + H;
}
// 运行部分
function tocode() {
    location.href=("/python/edit#"+ _work_id )
}
function builtinRead(n) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[n] === undefined)
    throw `File not found: '${n}'`;
  return Sk.builtinFiles.files[n];
}
// 代码模式运行
function run_it() {
  src = window.editor.getValue();

  var OP_Div = document.getElementById("output");
  OP_Div.innerHTML = "";
  Sk.pre = "output";
  Sk.configure({ output: outf, read: builtinRead });

  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {}))["target"] = "pythoncanvas";
  var draw_ = Sk.misceval.asyncToPromise(function () {
    f();
    return Sk.importMainWithBody("<stdin>", ![], src, !![]);
  });
  draw_.then(
    function (r) {},
    function (t) {
      alert(t.toString());
    }
  );
}

// 清除运行结果
function run_clear() {
  document.getElementById("output").innerHTML = "";
  document.getElementById("pythoncanvas").innerHTML = "";
}

function f() {
  if (Sk.TurtleGraphics || Sk.TurtleGraphics == {}) {
    var o = document.getElementById("canvas_box");
    var w = o.offsetWidth; //宽度
    var h = o.offsetHeight; //高度
    $("#pythoncanvas").css("height", h + "px");

    Sk.TurtleGraphics.width = w;
    Sk.TurtleGraphics.height = h;

    var C1 = $("#pythoncanvas>canvas:eq(0)");
    C1 = u(C1, w, h);

    var C2 = $("#pythoncanvas>canvas:eq(1)");
    C2 = u(C2, w, h);
  }
}
function u(C, W, H) {
  if (C.length > 0) {
    var D = C[0].getContext("2d");
    DC_ = D.getImageData(0, 0, C[0].width, C[0].height);
    C.attr("height", H).attr("width", W);
    D.putImageData(DC_, 0, 0);
    return C;
  }
}
