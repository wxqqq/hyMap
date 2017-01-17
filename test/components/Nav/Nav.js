/*
 * @Author: deyuhua
 * @Date: Thu Aug 25 15:08:19 2016
 * @Last modified by: Angelsamle
 * @Last modified time: Thu Aug 25 15:08:19 2016
 * @Email: deyuhua@gmail.com
 * @File Path: /home/deyuhua/workspace/tueasy/tueasy5.0/Visual3D/test/components/Nav/Nav.js
 * @File Name: Nav.js
 * @Descript:
 */

'use strict';
import NavCss from './Nav.css';
import React, {
    Component
} from 'react';
import {
    Link
} from 'react-router';

class Nav extends React.Component {

    render() {

        return (
            <div className = 'Nav'>
                <Link to = 'circle' > circle </Link>
                <Link to = 'icon' > icon </Link>
                 <Link to = 'line' > line </Link>
                </div>
        );
    }
}

export default Nav;