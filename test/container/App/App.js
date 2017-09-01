/*
 * @Author: zhangyujie
 * @Date:   2016-05-09 11:33:52
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-01 16:45:07
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\test\container\App\App.js
 * @File Name: App.js
 * @Descript:
 */

'use strict';

import React, {
    Component
} from 'react';
import Nav from '../../components/Nav/Nav';
import {
    Layout,
    Menu,
    Row,
    Col
} from 'antd';
const {
    SubMenu
} = Menu;
const {
    Header,
    Content,
    Sider
} = Layout;
import Editor from '../App/editor';
class App extends Component {
    menuClick = e => {

        window.location.hash = e.key;

    }
    render() {
        return (
            <Layout className='layout'>
                <Header style={{ height: '40px' }}>
                    <div className='logo' />
                    <Menu
                        onClick={this.menuClick}
                        theme='dark'
                        mode='horizontal'
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '40px' }}
                    >
                        <Menu.Item key='1'>API文档</Menu.Item>
                        <Menu.Item key='2'>例子</Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Sider
                        style={{
                            overflow: 'auto',
                            height: '95vh',
                            background: '#fff'
                        }}>
                        <Nav location={this.props.location} />
                    </Sider> 
                    <Layout>
                        <Content>
                        <div style={{flex:1}}>
                        <Editor/>
                        </div>
                        <div style={{flex:2}}>
                         {this.props.children}
                        </div>
                         
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}

export default App;