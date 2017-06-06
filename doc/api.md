#hyMap api说明
##配置项
[options](#options)  
[series](#series)  
[data](#data)

----
##方法
[类方法](#hygis.method)  
[实例方法](#instance.method)

-------
##1.配置项
### 1.1 <a name="options"></a>options选项说明
```
options:
  { 

    serverUrl: 'http://192.168.1.50:8080/geoserver', //服务器地址  

    show: true, //地图的显示状态 true为显示 false 为不显示  

    map: '中国|山东省', //undefined|(string|string|string) 为空不加载地图边界，否则按传入参数最后一个为当前级别进行数据加载,
    //目前测试数据包括3级，中国各个省，山东省，济南市的区域数据。

    drillDown: true, // true|false 是否开启区域点击下钻功能。  

    roam: 'true', // true|false|drag(只拖拽)|scale(只缩放) 开启缩放、平移功能  

    center: [118.6277, 36.588921], //当前视角中心: [经度, 纬度]  

    zoom: 6, //当前地图缩放级别  

    scaleLimit: [3, 20], //滚轮缩放的级别范围

    itemStyle: {//底图区域填充样式
          'normal': {//默认正常样式
              strokeWidth: 2, //边框宽度
              strokeColor: 'green', //边框颜色
              fillColor: 'rgba(255,255,255,0.2)'//填充色
          },
          'emphasis': {////选中样式
              strokeWidth: 1, //边框宽度
              fillColor: 'rgba(255,255,255,0.5)'
          }
      }, 

    label: {//底图区域块文本样式
        'normal': { //默认正常样式
              show: false, //显示或隐藏文本
              textStyle: {
                  color: '#fff', //颜色
                  fontStyle: 'normal',//样式
                  fontWeight: 'bold', //加粗
                  fontFamily: 'sans-serif', //字体
                  fontSize: '16pt' // 大小
              }
          },
          'emphasis': {//选中样式
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
  
    regions: [{//特殊区域样式设置
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
    }],

    theme: { // 底图样式 'dark'|'blue'|'white'|mapObject{mapId,key} 对应maobox中的mapid和access_token
        mapId: 'zhangyujie.a80cdc83',
        key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
    },

    tooltip: {//浮动层配置
        show: true,//显示浮动层
        trigger: 'item', // item、map  ['item', 'map'] ， 响应：数据，区域， 
        triggeron: 'mouseover', // 'click'|'mouseover'|['click','mouseover'] //触发条件
        enterable: false, //true|false 鼠标是否可进入浮出泡泡框中
        style: {//浮动层样式
            'border-color': '#cc0',
            'border-radius': '5',
            'border-width': '2',
            'border-style': 'solid',
            'width': '100',
            'height': '60'
        },
        formatter: function(param) { //浮动层的内容
            return  param.value;
        },
        position: function() { //浮动层锚点位置

            return [0, 0];

        }
    }

```
###1.2 series<a name='series'></a>选项说明
```
  series:{
    id:id,//唯一标识
    series: [   //数据对象数组
        {
          data: values,//数据

          cluster: {
              enable: false, //是否开启聚合
              distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
              animationDuration: 700 //聚合动画时间，默认为700毫秒
            },

          maxZoom: 10, //数据显示最大级别

          minZoom: 6, //数据显示最小级别

          type: 'point',//'point'|'line'|'polygon'

          symbol: 'icon:test/data/jingli-1.png',//'circle'|'icon:url'|heatmap

          symbolSize: [20, 30], //图标动态大小，最小值，最大值。

          symbolStyle: {//图标样式
            'normal': {//默认样式
                anchor: [0.5, 0.5],//图标偏移位置。
                color: 'red' //颜色,图标填充颜色，当图标为透明轮廓时，请启用该属性
                symbolSize: [15, 15],//特定图标大小，默认继承父级的symbolSize。
                fillColor: 'red', // 'rgb(140,0,140)', 线或面时的填充颜色
                strokeWitdh: 1,   // 线或面宽度
                strokeColor: 'rbg(140,0,140)' //线或面颜色
              },
            'emphasis': {//选中样式
                strokeWitdh: 2,
                fillColor: 'red',
                symbolSize: [30, 30]
               }
             },

            labelColumn: 'value', //文本读取字段

            labelSize: [15, 20],//文本动态大小范围值。
            label: {//文本样式
                'normal': {//默认样式
                    show: false,//是否显示
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                },
                'emphasis': {//选中样式
                    show: true,
                    textStyle: {
                        fontSize: '16px'
                    }

                }
            },
          }
    ]

  }
```

###1.3 <a name="data"></a>数据格式 说明

```
  data:[
      object:{
        id:id，//数据唯一标识。必须
        geoCoord:[x,y]//经纬度坐标 必须
        name:'name' //名称 
        value:'23213' //值 必须。
    }
  ]
```

##2.方法

### 2.1 类方法 <a name="hygis.method"></a>

```
hymap.init(DOM)  
初始化DOM, 返回instance实例
```

```
hymap.getInstanceByDom(dom)
根据DOM,返回instance实例
```

### 2.2 实例方法 <a name="instance.method"></a>


设置地图参数
```
setOption(options)  

```

注册事件 
eventName:'geoClick'|'geoUnclick'|'click'|'unClick'

```
instance.on(eventName, handler)  
 eg:on('geoClick', fn)| on('click', (param, event) => {
    console.log(param)
  }) | on('mouseover', fn) | on('zoom', fn)
绑定对地图区域点击 地图上元素的点击
```

解绑事件
```
instance.off(eventName, handler) 

```

触发事件

```   
instance.dispatchAction({
    type: 'geoSelect', || 'geoUnSelect' || 'geoToggleSelect'
    name: '天津市和平区'
  }) 
```

实例销毁
```
instance.dispose()  

```

改变地图所在div尺寸时调用地图重绘
```
instance.resize()

```

地图移动方法
```       
instance.flyTo([x,y],{
  zoom:number,//地图级别
  animateDuration: 2000,//动画执行时长
  animateEasing: '',//默认为线性
  callback:function//回调方法
  }) 
```

隐藏地图实例
```  
instance.hide({
  index: 0
  })

```

显示地图实例
```  
instance.show({

  }) 

```

显示地图边界

```
  instance.showGeo();
```

隐藏地图边界
```
  instance.hideGeo();
```

设置地图边界线
```
instance.setGeo(mapname:string)
china/shandongsheng/jinanshi 地址的拼音
```

显示底图
```
  instance.hideBaseMap();
```

隐藏底图    
```
  instance.hideBaseMap();
```

设置底图风格
```
instance.setTheme(theme:string)
'dark','blue','white' 默认为blue
```

设置请求服务器地址
```
instance.setServerUrl(url:string)
```

获取服务器地址
```
instance.getServerUrl()
```

增加数据
```
instance.addLayer(series)

```

更新数据
```
instance.updateLayer(series)

```

显示数据
```
instance.showLayer(id);
```

隐藏数据
```
instance.hideLayer(id);
```

删除指定的数据
```
instance.removeLayer(id)

```

删除所有数据
```
instance.removeLayer()

```

绘制轨迹（依赖路网数据,目前仅提供济南市的测试数据。）
```
instance.drawTrack([],[],{
  toooltipFun（data）
  })
//起点，终点，终点位置弹出层内容回调。
//data:{
//    length, （米）
//    time (分钟)
//}
```

绘制连接线
```
instance.drawCable(obj);
// obj:{
  id:123//唯一标识，默认为时间戳 
  geoCoord:[]//经纬度坐标
  end:[]//屏幕固定位置像素位置
}
return  id
```

更新连接线
```
instance.updateCable(obj);
// obj:{
  id:123//唯一标识，默认为时间戳 
  geoCoord:[]//经纬度坐标
  end:[]//屏幕固定位置像素位置
}
return id;
```

删除连接线
```
instance.removeCable(id);
```

叠加dom对象
```
instance.addOverlay(obj);
obj:{
  id:id,
  container:dom
  geoCoord:[],//坐标
  showLine:true|false,//显示连线
  linewidth:80//线的偏移长度。
  offset:[0,0],//偏移量
  positioning:'top-left'//top[center,bottom]-left[right];//相对位置

}
```