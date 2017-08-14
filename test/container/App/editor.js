/*
 * @Author: wxq
 * @Date:   2017-07-24 10:58:08
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-14 17:10:11
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\test\container\App\editor.js
 * @File Name: editor.js
 * @Descript: 
 */
'use strict';
import React, {
    Component
} from 'react';
import ace from 'brace';
import {
    EventEmitter
} from '../event';

require('brace/mode/javascript');
require('brace/theme/monokai');

class Editor extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

        this.editor = ace.edit('javascript-editor');
        this.editor.getSession().setMode('ace/mode/javascript');
        this.editor.setTheme('ace/theme/monokai');
        this.editor.getSession().on('change', () => {
            let interval;
            if (interval) {
                clearTimeout(interval);
            }
            interval = setTimeout(() => {
                let value = this.editor.getValue();
                let options = JSON.parse(value);
                this.mapObj.setOption(options);
            }, 1200);
        });
        EventEmitter.subscribe('setOption', ({
            options,
            mapObj
        }) => {

            this.editor.setValue(JSON.stringify(options, null, '\t'));
            this.mapObj = mapObj;

        })
    }
    componentDidUpdate() {

        // this.editor.setValue(JSON.stringify(this.props.options, null, '\t'));
    }
    render() {
        return (
            <div
                id="javascript-editor"
                style={{ minHeight: '596px', height: '100%' }}
            />
        );
    }
}

export default Editor;