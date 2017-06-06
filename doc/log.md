#version
##v0.1.46
增加周边查询，重构调用代码。
##v0.1.19
icon失真或不正常显示的问题。
icon支持color设置
layer支持事件注册。
注销事件
  un()所有事件,
  un(type)该类型下所有事件,
  un(type,fun)指定事件。
##v0.1.10
修复updatelayer时样式不生效。
###v0.1.9
修复updatelayer的错误。
###v0.1.8
增加haslayer(id)方法 判断layer是否存在。
###v0.1.7
修复打包bug。
###v0.1.6
增加轨迹查询 drawTrack(geocoord,radius,{tooltipfun});
###v0.1.5
serie增加显示字段名称，   labelColumn: 'value', //显示的字段名称
serie增加文本 
```
labelAnimate: {
                    enable: 'true', //是否开启动画
                    period: 1 //动画时间 单位 秒

                },
```
serie增加文本大小设置 labelSize: [12, 40], //单位 pt
###v0.1.4
增加周边查询方法：输入中心点和半径查询图上所有元素。
增加文本动画。文本的值发生变化会触发动画。放大显示该文本一段事件后回复初始化的大小。
修复roam设置为false不生效的问题。roam现在支持的参数为 true|'true'|false|'false'|'drag'|'scale'
***
###v0.1.3 
增加线的样式配置.
修复icon高度显示不正确的问题。
***
###v0.1.1
初次上传