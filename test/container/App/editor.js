/*
 * @Author: wxq
 * @Date:   2017-07-24 10:58:08
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-25 18:38:47
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
                this.props.mapObj.setOption(options);

            }, 1200);

        });

    }
    componentDidUpdate() {

        this.editor.setValue(JSON.stringify(this.props.options, null, '\t'));

    }
    render() {


        return (<div id='javascript-editor' style={{'minHeight':'596px','height':'auto'}}></div>);



    }
}

export default Editor;