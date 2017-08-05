/*
 * @Author: deyuhua
 * @Date: Thu Aug 25 15:08:19 2016
 * @Last modified by: Angelsamle
 * @Last modified time: Thu Aug 25 15:08:19 2016
 * @Email: deyuhua@gmail.com
 * @File Path: F:\work\hyMap\test\components\Nav\Nav.js
 * @File Name: Nav.js
 * @Descript:
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    Menu,
    Icon
} from 'antd';
const {
    SubMenu
} = Menu;
import {
    Link
} from 'react-router';

class Nav extends Component {
    constructor(props, context) {

        super(props, context);
        this.state = {
            current: '',
            openKeys: []
        };
        // this.setState({  
        //   current: '1',  
        //   openKeys: [],  
        // }).bind(this);  

    }
    componentWillMount() {

        let current = this.props.location.pathname
        console.log(this.props)
        var index = current.lastIndexOf("\/");
        current = current.substring(index + 1, current.length);
        this.setState({
            'current': current
        });
    }
    handleClick(e) {


        console.log('click ', e);
        this.setState({
            current: e.key,
            openKeys: e.keyPath.slice(1)
        });
        console.log(this.state.openKeys + this.state.current);

    }
    render() {

        return (
            <Menu  onClick={this.handleClick.bind(this)}
                   mode='inline' 
                   defaultSelectedKeys={[this.state.current]} 
                   defaultOpenKeys={['sub1','sub2','sub3']} 
                   style={{ height: '100%', borderRight: 0 }} >
                <SubMenu key='sub1' title={<span><Icon type='user' />地图方法</span>}>
                    <Menu.Item key='mapmethod'><Link to='mapmethod'>初始化</Link></Menu.Item>
                </SubMenu>
                <SubMenu key='sub2' title={<span><Icon type='laptop' />图层</span>}>
                    <Menu.Item key='icon'><Link to='icon'>icon</Link></Menu.Item>
                    <Menu.Item key='rect'><Link to='rect'>rect</Link></Menu.Item>
                    <Menu.Item key='line'><Link to='line'>line</Link></Menu.Item>
                    <Menu.Item key='region'><Link to='region'>region</Link></Menu.Item>
                    <Menu.Item key='heatmap'><Link to='heatmap'>heatmap</Link></Menu.Item>
                    <Menu.Item key='gps'><Link to='gps'>gps</Link></Menu.Item>
                </SubMenu>
                <SubMenu key='sub3' title={<span><Icon type='laptop' />动画</span>}>
                    <Menu.Item key='labelAnimate'><Link to='labelAnimate'>labelAnimate</Link></Menu.Item>
                    <Menu.Item key='ripple'> <Link to='ripple'>ripple</Link></Menu.Item>
                </SubMenu>
            </Menu>
        );

    }
}

export default Nav;