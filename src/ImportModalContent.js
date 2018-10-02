import React from "react";

class ImportModalContent extends React.Component {
  render() {
    return (

      <div id="modal-import-container">
        <h5> Imagenes :</h5>
          <hr/>
          <div className="row">
        {this.props.publicFiles.map(filePath => (
                <div className={ (filePath.split('/')[0] == 'emojis')? 'col-2' : 'col-6'} key={filePath}>
                    <img
                        src={filePath}
                        alt="noImage"
                        onClick={() => this.props.onImgPick(filePath)}
                        style={{maxWidth: "100%"}}
                    />

                </div>
        ))}
          </div>
      </div>
    );
  }
}

export default ImportModalContent;
