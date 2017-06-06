/*
 * @Author: zhangyujie
 * @Date:   2016-05-09 11:33:52
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-09 16:36:12
 * @Email: zhangyujie3344521@163.com
 * @File Path: H:\work\hyMap\test\container\App\App.js
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

        return (<div className = 'App'>
            <Nav/><div className='content'> {
                this.props.children
              
            }</div></div>);

    }
}

export default App;