import React, { Component } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./styles.css";

const LANDSCAPE = "landscape";
const PORTRAIT = "portrait";

class Demo extends Component {
  state = {
    frameMode: LANDSCAPE //or PORTRAIT
  };

  cropImage = () => {
    const dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.refs.croppedImage.src = dataUrl;
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

  render() {
    return (
      <div>
        <Cropper
          ref="cropper"
          src="./JExa2.jpg"
          style={{ height: 400, width: "100%" }}
          // Cropper.js options
          rotatable
          guides={false}
        />
        <hr />
        <button onClick={this.cropImage}>crop!</button>
        <button onClick={this.toggleFrameMode}>
          change to {this.state.frameMode === PORTRAIT ? LANDSCAPE : PORTRAIT}
          mode
        </button>
        <button onClick={this.rotateLeft}>Rotate left</button>
        <button onClick={this.rotateRight}>Rotate right</button>
        <hr />
        <div id="album-page-container">
          <div
            id="album-page-frame"
            className={this.state.frameMode}
            ref="albumPageFrame"
          >
            <img id="cropped-result-image" ref="croppedImage" />
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Demo />, rootElement);
