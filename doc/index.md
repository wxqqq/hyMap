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

    theme: { // 底图样式 'dark'|'blue'|'white'|mapObject{tpye,url,mapId,key} 对应maobox中的mapid和access_token
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

          type: 'point',//'point'|'line'|'polygon'|'track'|'gps'|'region'

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
          contexmenu:false//设置图层是否响应自定义右键功能

          map: '中国|山东省', //undefined|(string|string|string) 为空不加载地图边界，否则按传入参数最后一个为当前级别进行数据加载,
    //目前测试数据包括3级，中国各个省，山东省，济南市的区域数据。

    drillDown: true, // true|false 是否开启区域点击下钻功能。  
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
### 2.2 实例方法 <a name="instance.method"></a>

2. 注册事件 
eventName:''click'|'unClick'|'contexmenu'|'tooltipclick'|'mouseover'|'drawStart'

```
instance.on(eventName, handler)  
 eg:on('click', fn)| on('click', (param, event) => {
    console.log(param)
  }) | on('mouseover', fn) | on('zoom', fn)
绑定对地图区域点击 地图上元素的点击
```



测试用例 38个
外部调用方法接口共 52个 内部方法共287个
