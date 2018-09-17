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
  LANDSCAPE_HEIGHT,
  A4_SCALE,
  PORTRAIT_WIDTH,
  PORTRAIT_HEIGHT
} from "./ItemTypes";

import "cropperjs/dist/cropper.css";
import "./styles.css";
import {
  calculateLandscapeMeazures,
  calculatePortraitMeazures
} from "./ARHelpers";

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
    const { width, height } =
      this.state.frameMode === LANDSCAPE
        ? calculateLandscapeMeazures(canvas.width, canvas.height)
        : calculatePortraitMeazures(canvas.width, canvas.height);

    console.log(width, height);
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
            width: width,
            height: height
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

  handleImageResize = ({ key, width, height, ...position }) => {
    this.setState(({ croppedImages }) => ({
      croppedImages: {
        ...croppedImages,
        [key]: {
          ...croppedImages[key],
          left: position.x,
          top: position.y,
          width,
          height
        }
      }
    }));
  };

  exportFrameToPDF = () => {
    const input = document.getElementById("album-page-frame");
    html2canvas(input, {
      width:
        this.state.frameMode === LANDSCAPE ? LANDSCAPE_WIDTH : PORTRAIT_WIDTH,
      height:
        this.state.frameMode === LANDSCAPE ? LANDSCAPE_HEIGHT : PORTRAIT_HEIGHT,
      scale: A4_SCALE
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
            style={{ height: 500, width: "100%" }}
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
          <button onClick={this.exportFrameToPDF}>Export PDF</button>
        </div>
        <hr />

        <div id="album-page-container">
          <div id="album-page-view">
            <AlbumPageContainer
              frameMode={this.state.frameMode}
              croppedImages={this.state.croppedImages}
              handleImageMove={this.handleImageMove}
              handleImageResize={this.handleImageResize}
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
