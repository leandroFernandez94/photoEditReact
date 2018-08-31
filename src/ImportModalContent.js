import React from "react";

class ImportModalContent extends React.Component {
  render() {
    return (
      <div id="modal-import-container">
        <h3>Select Picture:</h3>
        {this.props.publicFiles.map(filePath => (
          <img src={filePath} onClick={() => this.props.onImgPick(filePath)} />
        ))}
      </div>
    );
  }
}

export default ImportModalContent;
