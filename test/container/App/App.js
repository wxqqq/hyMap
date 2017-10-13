/*
 * @Author: zhangyujie
 * @Date:   2016-05-09 11:33:52
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-20 18:21:17
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
    Icon,
    Button,
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
    state = {
        collapsed: false
    };
    onCollapse = (collapsed) => {

        console.log(collapsed);
        this.setState({
            collapsed
        });
    
    }
    render() {

        return (
            <Layout >
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
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse} 
                        style={{
                            overflow: 'auto', height: '96vh', left: 0
                        }}>
                        <Nav location={this.props.location} />
                    </Sider> 
                    <Layout>
                        <Content>
                        <div style={{flex:1}}>
                        <Editor/>
                        <div className='ant-button-fullmap'>
                            <Button type='left'>
                                <Icon type='left' />
                            </Button>
                        </div>
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