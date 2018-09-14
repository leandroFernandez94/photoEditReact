import React, { Component } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-cropper";
import Modal from "react-responsive-modal";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";

import ImportModalContent from "./ImportModalContent";
import AlbumPageContainer from "./AlbumPageContainer";

import { getPublicFiles } from "./FilesService";
import {
  LANDSCAPE,
  PORTRAIT,
  LANDSCAPE_WIDTH,
  LANDSCAPE_HEIGHT
} from "./ItemTypes";

import "cropperjs/dist/cropper.css";
import "./styles.css";

class Demo extends Component {
  state = {
    frameMode: LANDSCAPE, //or PORTRAIT
    publicFiles: [],
    croppedImages: {},
    importModal: false,
    workingPicturePath: null,
    croppedIds: 0
  };

  componentWillMount() {
    getPublicFiles().then(files => this.setState({ publicFiles: files }));
  }

  cropImage = () => {
    const canvas = this.refs.cropper.getCroppedCanvas();
    const dataUrl = canvas.toDataURL();
    const { width, height } = canvas;

    this.setState(
      ({ croppedImages, croppedIds }) => ({
        //croppedImages: [...croppedImages, dataUrl]
        croppedImages: {
          ...croppedImages,
          [this.state.croppedIds]: {
            id: this.state.croppedIds,
            path: dataUrl,
            top: 0,
            left: 0,
            width,
            height
          }
        },
        croppedIds: croppedIds + 1
      }),
      () => console.log(this.state)
    );
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

  handleImageMove = (key, left, top) => {
    this.setState(({ croppedImages }) => ({
      croppedImages: {
        ...croppedImages,
        [key]: {
          ...croppedImages[key],
          left,
          top
        }
      }
    }));
  };

  exportFrameToPDF = () => {
    const input = document.getElementById("album-page-frame");
    html2canvas(input, {
      width: LANDSCAPE_WIDTH,
      height: LANDSCAPE_HEIGHT,
      scale: 1.335
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: this.state.frameMode,
        unit: "px"
      });
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  };

  render() {
    return (
      <div>
        {this.state.workingPicturePath && (
          <Cropper
            ref="cropper"
            src={this.state.workingPicturePath}
            style={{ height: 400, width: "100%" }}
            rotatable
            aspectRatio={1.4151226}
            guides={true}
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
          <button onClick={this.exportFrameToPDF}>Export PDF</button>
        </div>
        <hr />

        <div id="album-page-container">
          <div id="album-page-view">
            <AlbumPageContainer
              frameMode={this.state.frameMode}
              croppedImages={this.state.croppedImages}
              handleImageMove={this.handleImageMove}
            />
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
