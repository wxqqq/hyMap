#version
##v0.2.39
1.panTo上下修改为up,down,
2.layerGroup增加visible，opacity参数。优化group id创建流程.
##v0.2.38
1.增加zoomTo(num,relative)接口
2.增加PanTo(num,direction)接口
3.setRadius接口增加参数提供相对数据获取绝对数值的判断。
4.serie增加visible,opacity参数
##v0.2.29
trackLayer修改initRoute为update，统一接口。完善clear方法。
##v0.2.26
空间查询增加changeRadius方法，支持动态修改绘制的圆和线buff的半径修改。
##v0.2.25
theme增加多图层配置使用数组进行配置。
##v0.2.19
空间查询增加线周边下版本增加动态修改半径接口。
##v0.2.18
增加获取当起视窗option方法，
增加获取数据方法。
##v0.2.8
overlay增加判断，点击会显示到最前
addoverlay默认container为空div.可以用getElemnt进行获取.
##v0.2.7
空间查询返回值增加circle参数。
##v0.2.1
注意此版本部分与此前不兼容
1.setoption 选项，移除map相关配置
包括map,  drillDown, label, itemStyle,  region:selectedMode,
包括event事件中的geoClick,geoUnClick.
现在的geo更改为layer控制 使用 addLayer进行添加 配置项如下：
```
serie={W
    type: 'region',
            location: '中国', //当前地图显示哪个地图
            drillDown: true, //是否开启区域点击下钻功能。
            label: {
                'normal': {
                    show: false,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                },
                'emphasis': {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                }
            },
            itemStyle: {
                'normal': {
                    strokeWidth: 2, //边框宽度
                    strokeColor: 'green', //边框颜色
                    fillColor: 'rgba(255,255,255,0.2)'
                },
                'emphasis': {
                    strokeWidth: 1, //边框宽度
                    fillColor: 'rgba(255,255,255,0.5)'
                }
            }, //地图上每块区域的样式
            special: [{
                name: '山东省',
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: 'blue', //边框颜色
                        fillColor: '#2a333d'
                    },
                    'emphasis': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#B5FF91', //边框颜色
                        fillColor: 'blue'
                    }
                },
                label: {
                    'normal': {
                        show: false,
                        textStyle: {
                            color: 'red'
                        }
                    },
                    'emphasis': {
                        show: true,
                        textStyle: {
                            color: '#B5FF91',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '16px'
                        }

                    }
                }
            }], //  name: '',特殊区域的样式
            selectedMode: '', //地图区域的选中模式 single mulit 
     };       
```
2. 底图 theme 增加互联网地图配置 sougou//搜狗地图  tianditu//天地图 gaode//高德  google//　谷歌
3. layer增加special选择，可以进行特殊样式的控制。如1中special的设置
4. layer增加tooltip设置。

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