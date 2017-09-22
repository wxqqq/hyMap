# hy-map

海云map部署说明

## 使用

###使用  
 
 1. 执行安装.

    `
    npm install hy-map
    `

 2. 在代码中引入 hy-map

    `
    import hymap from hy-map;
    `
    或者
    `
    require('hy-map');
    `

###测试
 
 依赖：
    node,webpack ,react,antd, brace
 
 1. git clone 源码
 2. 执行 npm install
 3. 执行 npm build:dll 生成依赖lib文件
 4. 执行 npm  start 启动服务
 5. 在浏览器输入 localhsot：8110查看例子

------
###api手册
[api](doc/API/index.html)
###更新日志
[log](doc/log.md)

###地图命名规范

一、地理底图命名规则：

1.矢量切片命名行政区名+“_”+vector+”_”+样式+”gp”  例如：shandongsheng_ vector _dark_gp

2.卫星影像切片命名： 行政区名+“_”+satellite+”_”+”gp”  例如：shandongsheng_satellite_gp

##路网分析服务

##附录

###比例尺对应关系

0 1000KM

1 5000km

2 2500KM（图上2cm对应2500KM）

3 2000km

4 1000km

5 500km

6 200km

7 100km

8 50km

9 20km

10 10km

11 5km

12 2.5km(图上2cm对应5公里)

13 2km

14 1000m

15 500m

16 200m

17 100m

18 50m

19 20m

20 10m

