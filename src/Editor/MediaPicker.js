import React, { Component } from 'react'

import PropTypes from 'prop-types';

import htmlToDraft from 'html-to-draftjs';
import { EditorState, Modifier } from 'draft-js';
import { List } from 'immutable';
import './MediaPicker.css';
import { file } from '@babel/types';




export default class MediaPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            fileList: [],
            selected: "",
            width: "auto",
            height: "auto",
            error: ""
        }
        this.loadImages();
    }

    updateFileList = (fileList) => {
        this.setState({
            fileList
        })

    }

    loadImages = () => {
        try {
            this.props.imageLoadFunction().then(res => {
                this.setState({
                    fileList: res.files
                })
            })
        } catch (error) {
            this.setState({
                error: "Image Load Function is invalid"
            })
            throw error;
        }

    }
    static propTypes = {
        onChange: PropTypes.func,
        editorState: PropTypes.object,
    };


    openPlaceholderDropdown = () => this.setState({ open: !this.state.open })




    imageSelected = (file) => {
        this.setState({
            selected: file
        })
    }

    onWidthChange = (e) => {
        this.setState({
            width: e.currentTarget.value
        })
    }
    onHeightChange = (e) => {
        this.setState({
            height: e.currentTarget.value
        })
    }
    insertImage = () => {
        const { selected, width, height } = this.state;
        const { editorState, onChange } = this.props;
        debugger    
        const contentBlock = htmlToDraft(`<p></p><img src='${selected}' style="width:${width}px;height:${height}px" /><p></p>`);
        let contentState = editorState.getCurrentContent();
        contentBlock.entityMap.forEach((value, key) => {
            contentState = contentState.mergeEntityData(key, value);
        });
        contentState = Modifier.replaceWithFragment(
            contentState,
            editorState.getSelection(),
            new List(contentBlock.contentBlocks)
        );
        onChange(EditorState.push(editorState, contentState, "insert-image"));
    }

    render() {
        const { fileList, selected } = this.state;
        return (
            <>
                <div onClick={this.openPlaceholderDropdown} className="rdw-image-wrapper" aria-label="rdw-image-control">
                    <div className="rdw-option-wrapper" aria-label="rdw-dropdown">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTQuNzQxIDBILjI2Qy4xMTYgMCAwIC4xMzYgMCAuMzA0djEzLjM5MmMwIC4xNjguMTE2LjMwNC4yNTkuMzA0SDE0Ljc0Yy4xNDMgMCAuMjU5LS4xMzYuMjU5LS4zMDRWLjMwNEMxNSAuMTM2IDE0Ljg4NCAwIDE0Ljc0MSAwem0tLjI1OCAxMy4zOTFILjUxN1YuNjFoMTMuOTY2VjEzLjM5eiIvPjxwYXRoIGQ9Ik00LjEzOCA2LjczOGMuNzk0IDAgMS40NC0uNzYgMS40NC0xLjY5NXMtLjY0Ni0xLjY5NS0xLjQ0LTEuNjk1Yy0uNzk0IDAtMS40NC43Ni0xLjQ0IDEuNjk1IDAgLjkzNC42NDYgMS42OTUgMS40NCAxLjY5NXptMC0yLjc4MWMuNTA5IDAgLjkyMy40ODcuOTIzIDEuMDg2IDAgLjU5OC0uNDE0IDEuMDg2LS45MjMgMS4wODYtLjUwOSAwLS45MjMtLjQ4Ny0uOTIzLTEuMDg2IDAtLjU5OS40MTQtMS4wODYuOTIzLTEuMDg2ek0xLjgxIDEyLjE3NGMuMDYgMCAuMTIyLS4wMjUuMTcxLS4wNzZMNi4yIDcuNzI4bDIuNjY0IDMuMTM0YS4yMzIuMjMyIDAgMCAwIC4zNjYgMCAuMzQzLjM0MyAwIDAgMCAwLS40M0w3Ljk4NyA4Ljk2OWwyLjM3NC0zLjA2IDIuOTEyIDMuMTQyYy4xMDYuMTEzLjI3LjEwNS4zNjYtLjAyYS4zNDMuMzQzIDAgMCAwLS4wMTYtLjQzbC0zLjEwNC0zLjM0N2EuMjQ0LjI0NCAwIDAgMC0uMTg2LS4wOC4yNDUuMjQ1IDAgMCAwLS4xOC4xTDcuNjIyIDguNTM3IDYuMzk0IDcuMDk0YS4yMzIuMjMyIDAgMCAwLS4zNTQtLjAxM2wtNC40IDQuNTZhLjM0My4zNDMgMCAwIDAtLjAyNC40My4yNDMuMjQzIDAgMCAwIC4xOTQuMTAzeiIvPjwvZz48L3N2Zz4=" alt="" />
                    </div>
                </div>

                <div className={`rdw-media-picker-modal ${this.state.open ? 'show' : 'hide'}`}>

                    <div className="rdw-media-picker-body">
                        {fileList && fileList.length > 0 ?
                            <>
                                {fileList.map(file => {
                                    return (
                                        <div className={`rdw-image-block ${(selected == file) ? "active" : ""}`}>
                                            <img src={file} onClick={() => this.imageSelected(file)} />
                                        </div>
                                    );
                                })}



                            </>
                            : this.state.error ? <span style={{ color: "red" }}>
                                {this.state.error}
                            </span> : <></>}

                    </div>
                    <div className="rdw-media-picker-footer">

                        <div class="rdw-image-modal-size">
                            ↕&nbsp;
                        <input name="height" class="rdw-image-modal-size-input" onChange={this.onHeightChange} placeholder="Height" value={this.state.height} />
                            <span class="rdw-image-mandatory-sign">*</span>&nbsp;↔&nbsp;
                            <input name="width" class="rdw-image-modal-size-input" onChange={this.onWidthChange} placeholder="Width" value={this.state.width} />
                            <span class="rdw-image-mandatory-sign">*</span>
                        </div>


                        <button className="rdw-embedded-modal-btn" onClick={this.insertImage}
                            disabled={!selected ? "disabled" : ""}>Add</button>
                    </div>

                </div>
            </>
        );
    }
}
