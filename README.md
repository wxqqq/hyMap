# hy-map

海云map部署说明

## 部署
1.确保安装node以及npm 包管理工具: https://nodejs.org/en/download/
2.全局安装webpack: http://webpack.github.io/docs/tutorials/getting-started/
```
npm install webpack -g
```
3.执行安装
```
npm install hy-map
```
4.运行
```
在 代码中引入 hy-map
import hymap from hy-map;
或者 require('hy-map');
```

------
###api手册
[api](doc/API/index.html)
###更新日志
[log](doc/log.md)

###地图命名规范

一、地理底图命名规则：
1.矢量切片命名： 行政区名+“_”+vector+”_”+样式+”gp”  例如：shandongsheng_ vector _dark_gp
2.卫星影像切片命名： 行政区名+“_”+satellite+”_”+”gp”  例如：shandongsheng_satellite_gp


##路网分析服务

##比例尺对应关系

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

