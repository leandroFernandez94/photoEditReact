import React from "react";

import { DropTarget, DragDropContext } from "react-dnd";

import HTML5Backend from "react-dnd-html5-backend";
import ItemTypes from "./ItemTypes";
import Box from "./Box";

const boxTarget = {
  drop(props, monitor, component) {
    if (!component) {
      return;
    }
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    component.moveBox(item.id, left, top);
  }
};

export default DragDropContext(HTML5Backend)(
  DropTarget(ItemTypes.BOX, boxTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))(
    class AlbumPageContainer extends React.Component {
      render() {
        const { connectDropTarget, croppedImages } = this.props;
        return (
          connectDropTarget &&
          connectDropTarget(
            <div id="album-page-frame" className={this.props.frameMode}>
              {Object.keys(croppedImages).map(key => {
                const { left, top, path } = croppedImages[key];
                return (
                  <Box id={key} key={key} path={path} left={left} top={top} />
                );
              })}
            </div>
          )
        );
      }

      moveBox(key, left, top) {
        this.props.handleImageMove(key, left, top);
      }
    }
  )
);
