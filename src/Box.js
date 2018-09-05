import * as React from "react";
import { DragSource } from "react-dnd";
import ItemTypes from "./ItemTypes";

const boxSource = {
  beginDrag(props) {
    const { id, left, top } = props;
    return { id, left, top };
  }
};

export default DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
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
