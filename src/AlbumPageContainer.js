import React from "react";
import { Rnd } from "react-rnd";

export default class AlbumPageContainer extends React.Component {
  renderCropped = key => {
    const cropped = this.props.croppedImages[key];
    const size = {
      width: cropped.width,
      height: cropped.height
    };
    const position = {
      x: cropped.left,
      y: cropped.top
    };

    return (
      <Rnd
        key={key}
        lockAspectRatio
        bounds="parent"
        size={size}
        position={position}
        onDragStop={(e, d) => {
          this.props.handleImageMove(key, d.x, d.y);
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.props.handleImageResize({
            key,
            width: ref.style.width,
            height: ref.style.height,
            ...position
          });
        }}
      >
        <img
          className="cropped-result-image"
          src={cropped.path}
          alt="noimage"
          draggable="false"
        />
      </Rnd>
    );
  };

  render() {
    const { croppedImages } = this.props;
    return (
      <div id="album-page-frame" className={this.props.frameMode}>
        {Object.keys(croppedImages).map(this.renderCropped)}
      </div>
    );
  }
}
