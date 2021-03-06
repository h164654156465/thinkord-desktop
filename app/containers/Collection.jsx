// React modules
import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from '../components/layout/Navigationbar';
import ExportModal from '../components/ExportModal';
import './css/Collection.css';

// ELectron module
import { ipcRenderer } from "electron";

// Third-party packages
// This is to block UI interaction while user adding blocks to collection
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

// Renderer shortcut
const Mousetrap = require('mousetrap');

class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveSign: true,
      title: '',
      modalShow: false
    }
  }

  componentDidMount() {
    ipcRenderer.once('init-collection-title', (event, title) => {
      this.setState({ title: title });
    });

    // When you press stop recording, then you could save collection
    ipcRenderer.on('savebutton', () => {
      this.setState({ saveSign: !this.state.saveSign });
    });

    // When you press start recording, the you could not save collection
    ipcRenderer.on('hidesavebutton', () => {
      this.setState({ saveSign: !this.state.saveSign });
    });

    // With Mousetrap package, you should specify "Ctrl" as "ctrl"
    Mousetrap.bind(['ctrl+s', 'ctrl+S'], () => {
      this.saveChange();
    });

    Mousetrap.bind(['ctrl+z', 'ctrl+Z'], () => {
      ipcRenderer.send('pre-step-click');
    });

    Mousetrap.bind(['ctrl+y', 'ctrl+Y'], () => {
      ipcRenderer.send('next-step-click');
    });
  }

  // Return to Mainwindow
  returnToMain = () => ipcRenderer.send('return-to-home');

  // Write data to the json file
  saveChange = () => ipcRenderer.send('save-collection');

  handleExport = () => {
    ipcRenderer.send('download-html');
    ipcRenderer.once('download-html', () => {
      this.setState({ modalShow: false });
    });
  }

  // When you click the button, the screen would scroll to the bottom of collection
  scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  // When you click the button, the screen would scroll to the top of collection
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  // When you click the button, collection would change its state to the previous one
  handleClickPreviousStep = () => {
    ipcRenderer.send('pre-step-click');
  }

  // When you click the button, collection would change its state to the next one
  handleClickNextStep = () => {
    ipcRenderer.send('next-step-click');
  }

  // Change the content of title
  handleTitle = (title) => {
    if (title === '') return;
    else this.setState({ title: title });
  }

  render() {
    return (
      <BlockUi tag="div" blocking={!this.state.saveSign} >
        <div className="App" id="App">
          <div className="pageContent" id="content">
            <Header title={this.state.title} handleTitle={this.handleTitle} />
            <div><Progressbar /></div>
            <BlockContainer
              onNewBlock={this.scrollToBottom}
              ReturnToTop={this.scrollToTop}
              clickHome={this.returnToMain}
              clickSave={this.state.saveSign && this.saveChange}
              title={this.state.title}
            />
            {!this.state.modalShow &&
              <Navigationbar
                clickPreviousStep={this.handleClickPreviousStep}
                clickNextStep={this.handleClickNextStep}
                clickSave={this.saveChange}
                clickHome={this.returnToMain}
                clickExport={() => { this.setState({ modalShow: true }) }}
                clickTop={this.scrollToTop}
                clickBottom={this.scrollToBottom}
              />}
            <ExportModal
              show={this.state.modalShow}
              title={this.state.title}
              onExport={this.handleExport}
              onHide={() => this.setState({ modalShow: false })}
            />
          </div>
        </div>
      </BlockUi >
    )
  }
}

export default Collection;
