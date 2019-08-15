import React, { Component } from 'react';

export class Navigationbar extends Component {
    constructor(props) {
        super(props);
    }

    //select all checkboxes
    selectAllBoxes = () => {
        const selectAll = document.getElementsByClassName("check");
        let i = 0;
        let alreadySelectAll = true;
        for (i = 0; i < selectAll.length; i++) {
            if (selectAll[i].checked != true) { alreadySelectAll = false }
        }

        if (alreadySelectAll) {
            for (i = 0; i < selectAll.length; i++) {
                selectAll[i].checked = false;
            }
        } else {
            for (i = 0; i < selectAll.length; i++) {
                selectAll[i].checked = true;
            }
        }
    }


    render() {
        return (
            <div className="navigatorContainer" >
                <div className="navigationBar viewMode">
                    <div className="search"><div><input type="text" placeholder=" Search . . ." required /></div></div>
                    <i className="fas fa-undo" onClick={this.props.clickPreviousStep}></i>
                    <i className="fas fa-redo" onClick={this.props.clickNextStep}></i>
                    <i className="far fa-check-square" onClick={this.selectAllBoxes}></i>
                    <i className="far fa-save" onClick={this.props.clickSave}></i>
                    <i className="fas fa-arrow-up"></i>
                    <i className="fas fa-home" onClick={this.props.clickHome}></i>
                </div>
            </div>
        )
    }
}

export default Navigationbar
