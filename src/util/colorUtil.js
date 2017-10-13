/*
 * @Author: wxq
 * @Date:   2017-03-21 17:39:36
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-03-30 19:11:47
 */

//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
function colorHex(str) {

    var that = str;
    if (/^(rgb|RGB)/.test(that)) {

        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
        var strHex = '#';
        for (var i = 0; i < aColor.length; i++) {

            var hex = Number(aColor[i]).toString(16);
            if (hex === '0') {

                hex += hex;
            
            }
            strHex += hex;
        
        }
        if (strHex.length !== 7) {

            strHex = that;
        
        }
        return strHex;
    
    } else if (reg.test(that)) {

        var aNum = that.replace(/#/, '').split('');
        if (aNum.length === 6) {

            return that;
        
        } else if (aNum.length === 3) {

            var numHex = '#';
            for (var i = 0; i < aNum.length; i += 1) {

                numHex += (aNum[i] + aNum[i]);
            
            }
            return numHex;
        
        }
    
    } else {

        return that;
    
    }

}

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
function colorRgb(str) {

    var sColor = str.toLowerCase();
    if (sColor && reg.test(sColor)) {

        if (sColor.length === 4) {

            var sColorNew = '#';
            for (var i = 1; i < 4; i += 1) {

                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            
            }
            sColor = sColorNew;
        
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {

            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
        
        }
        return 'RGB(' + sColorChange.join(',') + ')';
    
    } else {

        return sColor;
    
    }

}

function hexToRgba(rgb_color, alp) {

    var r = parseInt('0x' + rgb_color.substr(1, 2));
    var g = parseInt('0x' + rgb_color.substr(3, 2));
    var b = parseInt('0x' + rgb_color.substr(5, 2));
    var a = alp; //为透明度
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

}

function rgbaToRgb(rgba_color) {

    //注：rgba_color的格式为rgba(0,0,0,0.1)
    var BGcolur = 1;
    var arr = rgba_color.split('(')[1].split(')')[0].split(',');
    var a = arr[3];
    var r = BGcolur * (1 - a) + arr[0] * a;
    var g = BGcolur * (1 - a) + arr[1] * a;
    var b = BGcolur * (1 - a) + arr[2] * a;
    return 'rgb(' + r + ',' + g + ',' + b + ')';

}
const colorUtil = {
    rgbaToRgb: rgbaToRgb,
    hexToRgba: hexToRgba,
    colorRgb: colorRgb,
    colorHex: colorHex
};
export default colorUtil;