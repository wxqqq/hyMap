/*
 * @Author: zhangyujie
 * @Date:   2016-05-09 11:33:52
 * @Last Modified by:   hydata
 * @Last Modified time: 2017-01-17 19:08:57
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/node/www/tueasy5.0/visual/Test/container/App/App.js
 * @File Name: App.js
 * @Descript:
 */

'use strict';

import React, {
    Component
} from 'react';
import Nav from '../../components/Nav/Nav';

class App extends Component {

    render() {

        return ( < div className = 'App' >
            < Nav / > {
                this.props.children
            } < /div>
        );
    }
}

export default App;