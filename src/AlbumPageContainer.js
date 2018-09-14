import React from "react";

import { DropTarget, DragDropContext } from "react-dnd";

import HTML5Backend from "react-dnd-html5-backend";
import ItemTypes from "./ItemTypes";
import Box from "./Box";

import {
  LANDSCAPE,
  LANDSCAPE_HEIGHT,
  LANDSCAPE_WIDTH,
  PORTRAIT_HEIGHT,
  PORTRAIT_WIDTH,
  BOX
} from "./ItemTypes";

const boxTarget = {
  drop(props, monitor, component) {
    if (!component) {
      return;
    }
    const item = monitor.getItem();
    console.log(item);
    const delta = monitor.getDifferenceFromInitialOffset();
    const leftPosition = Math.round(item.left + delta.x);
    const topPosition = Math.round(item.top + delta.y);

    let left, top;
    if (props.frameMode === LANDSCAPE) {
      if (leftPosition + item.width > LANDSCAPE_WIDTH) {
        left = LANDSCAPE_WIDTH - item.width;
      } else left = leftPosition < 0 ? 0 : leftPosition;
      if (topPosition + item.height > LANDSCAPE_HEIGHT) {
        top = LANDSCAPE_HEIGHT - item.height;
      } else top = topPosition < 0 ? 0 : topPosition;
    } else {
      if (leftPosition + item.width > PORTRAIT_WIDTH) {
        left = PORTRAIT_WIDTH - item.width;
      } else left = leftPosition < 0 ? 0 : leftPosition;
      if (topPosition + item.height > PORTRAIT_HEIGHT) {
        top = PORTRAIT_HEIGHT - item.height;
      } else top = topPosition < 0 ? 0 : topPosition;
    }

    component.moveBox(item.id, left, top);
  }
};

export default DragDropContext(HTML5Backend)(
  DropTarget(BOX, boxTarget, connect => ({
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
                return <Box {...croppedImages[key]} key={key} />;
              })}
            </div>
          )
        );
      }

      moveBox(key, left, top) {
        console.log(left, top);
        this.props.handleImageMove(key, left, top);
      }
    }
  )
);
