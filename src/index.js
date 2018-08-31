import React, { Component } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-cropper";
import Modal from "react-responsive-modal";

import ImportModalContent from "./ImportModalContent";

import { getPublicFiles } from "./FilesService";

import "cropperjs/dist/cropper.css";
import "./styles.css";

const LANDSCAPE = "landscape";
const PORTRAIT = "portrait";

class Demo extends Component {
  state = {
    frameMode: LANDSCAPE, //or PORTRAIT
    publicFiles: [],
    croppedImages: [],
    importModal: false,
    workingPicturePath: null
  };

  componentWillMount() {
    getPublicFiles().then(files => this.setState({ publicFiles: files }));
  }

  cropImage = () => {
    const dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState(({ croppedImages }) => ({
      croppedImages: [...croppedImages, dataUrl]
    }));
  };

  toggleFrameMode = () => {
    this.setState(({ frameMode }) => ({
      frameMode: frameMode === PORTRAIT ? LANDSCAPE : PORTRAIT
    }));
  };

  rotateLeft = () => {
    this.refs.cropper.rotate(-90);
  };

  rotateRight = () => {
    this.refs.cropper.rotate(90);
  };

  onOpenModal = () => {
    this.setState(prevState => ({ importModal: !prevState.importModal }));
  };

  onCloseModal = () => {
    this.setState(prevState => ({ importModal: !prevState.importModal }));
  };

  handleImgPick = imgPath => {
    this.setState({ workingPicturePath: imgPath }, this.onCloseModal);
  };

  render() {
    return (
      <div>
        {this.state.workingPicturePath && (
          <Cropper
            ref="cropper"
            src={this.state.workingPicturePath}
            style={{ height: 400, width: "100%" }}
            // Cropper.js options
            rotatable
            guides={false}
          />
        )}
        <hr />
        <div id="controls-container">
          <button onClick={this.onOpenModal}>Select Picture</button>
          <button onClick={this.cropImage}>crop!</button>
          <button onClick={this.toggleFrameMode}>
            {`change to ${
              this.state.frameMode === PORTRAIT ? LANDSCAPE : PORTRAIT
            } mode`}
          </button>
          <button onClick={this.rotateLeft}>Rotate left</button>
          <button onClick={this.rotateRight}>Rotate right</button>
        </div>
        <hr />
        <div id="album-page-container">
          <div
            id="album-page-frame"
            className={this.state.frameMode}
            ref="albumPageFrame"
          >
            {this.state.croppedImages.map(cropped => (
              <img class="cropped-result-image" src={cropped} />
            ))}
          </div>
        </div>
        <Modal open={this.state.importModal} onClose={this.onCloseModal} center>
          <ImportModalContent
            publicFiles={this.state.publicFiles}
            onImgPick={this.handleImgPick}
          />
        </Modal>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Demo />, rootElement);
