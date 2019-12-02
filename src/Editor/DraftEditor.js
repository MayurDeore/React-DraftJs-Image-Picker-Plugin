import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MediaPicker from './MediaPicker';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


const cdnLink = "http://localhost:5000/";

export default class DraftEditor extends Component {

    constructor(props) {
        super(props);
        const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }
    }

    imageLoadFunction = () => {

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'http://localhost:5000/directory/');
            xhr.send();
            let self = this;
            xhr.onload = function() {
                if (xhr.status != 200) { // analyze HTTP status of the response
                    console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                } else { // show the result
                    let fileList = JSON.parse(xhr.response);
                    fileList = fileList.map(file => {
                        return cdnLink + file;
                    })
                    return resolve({
                        files: fileList
                    })
                }
            };
        })

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    render() {
            const { editorState } = this.state;
            return ( <
                div >
                <
                Editor editorState = { editorState }
                toolbarClassName = "toolbarClassName"
                wrapperClassName = "wrapperClassName"
                editorClassName = "editorClassName"
                onEditorStateChange = { this.onEditorStateChange }
                toolbarCustomButtons = {
                    [ < MediaPicker imageLoadFunction = { this.imageLoadFunction }
                        />]} / >
                        <
                        /div>
                    )
                }
            }