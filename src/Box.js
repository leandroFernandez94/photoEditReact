import * as React from "react";
import { DragSource } from "react-dnd";
import { BOX } from "./ItemTypes";

const boxSource = {
  beginDrag(props) {
    const { id, left, top, width, height } = props;
    return { id, left, top, width, height };
  }
};

export default DragSource(BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(
  class Box extends React.Component {
    render() {
      const { path, left, top, connectDragSource } = this.props;

      return (
        connectDragSource &&
        connectDragSource(
          <img
            className="cropped-result-image"
            style={{ left, top }}
            src={path}
            alt="noimage"
          />
        )
      );
    }
  }
);
