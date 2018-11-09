import React from "react";

import AlbumPageContainer from "./AlbumPageContainer";

import Cropper from "react-cropper";



class CropperModalContent extends React.Component {

    rotateLeft = () => {
        this.refs.cropper.rotate(-15);
    };

    rotateRight = () => {
        this.refs.cropper.rotate(15);
    };
    cropImage = () => {
        this.props.cropImage(this.refs.cropper.getCroppedCanvas())
    }

    render() {
        return (

            <div id="modal-import-container" >
                <h5> Edicion: </h5>
                <hr style={{ border: 0, clear: 'both', display: 'block', width: '100%', backgroundColor:'#4950573d', margin: '0px', height: '1px'}} />
                <div className={'row horizontal-center'} >
                    <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.cropImage} title={"Guardar seleccion"}>
                        <i className={'la la-cut'}> </i>
                        Guardar
                        </button >
                    <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.rotateRight} title={"Rotar a la derecha"} >
                        < i className={'la la-rotate-right'}></i>
                        Rotar der.
                        </button>
                    <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.rotateLeft} title={"Rotar a la izquierda"} >
                        <i className={'la la-rotate-left'} > </i>
                        Rotar izq.
                        </button>
                </div>
                <hr style={{ border: 0, clear: 'both', display: 'block', width: '100%', backgroundColor: '#4950573d', margin: '0px', height: '1px' }} />
                <div id={'cropper'}>
                    {this.props.state.workingPicturePath && (
                        <Cropper
                            ref="cropper"
                            src={this.props.state.workingPicturePath}
                            style={{ height: 300, width: "100%" }}
                            rotatable
                            guides={false}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default CropperModalContent;