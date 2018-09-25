import React, { Component } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-cropper";
import Modal from "react-responsive-modal";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css';
import './line-awesome/css/line-awesome.min.css'

import ImportModalContent from "./ImportModalContent";
import AlbumPageContainer from "./AlbumPageContainer";

import {getBackgrounds, getEmoticones, getPublicFiles} from "./FilesService";
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
      images: [],
    importModal: false,
    workingPicturePath: 'flores.jpg',
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

      /*for( let i=0; i<this.state.croppedIds; i++){
          let width = Math.min(this.state.croppedImages[i].width, 396)
          this.handleImageResize( {key: i.toString(), width: width +'px', height: this.state.croppedImages[i].height +'px', x: 0, y: this.state.croppedImages[i].top})
      }*/
      this.setState(({ frameMode}) => ({
          frameMode: frameMode === PORTRAIT ? LANDSCAPE : PORTRAIT,
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

    selectEmojis = () => {
        getEmoticones().then(files => this.setState({ publicFiles: files }));
        this.onOpenModal()
    }

  selectPictures = () => {
      getPublicFiles().then(files => this.setState({ publicFiles: files }));
      this.onOpenModal()
  }

  selectBackgrouds = () => {
      getBackgrounds().then(files => this.setState({ publicFiles: files }));
    this.onOpenModal()
  }

  handleImgPick = imgPath => {
    this.setState({ workingPicturePath: imgPath }, this.onCloseModal);
      //document.getElementById("cropper").classList.remove("d-none");
  };

  handleImageMove = (key, left, top) => {
      console.log(key, left, top)
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

  handleImageResize = ({key, width, height, ...position}) => {
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

  saveImg = () => {
    const input = document.getElementById("album-page-frame");
    html2canvas(input, {
      width:
        this.state.frameMode === LANDSCAPE ? LANDSCAPE_WIDTH : PORTRAIT_WIDTH,
      height:
        this.state.frameMode === LANDSCAPE ? LANDSCAPE_HEIGHT : PORTRAIT_HEIGHT,
      scale: 2
    }).then(canvas => {
        console.log(canvas.toDataURL("image/png"))
        let newImages = this.state.images
            newImages.push({dataUrl: canvas.toDataURL("image/png"), orientation: this.state.frameMode})
        this.setState(({images}) => ({images: newImages}))
        //document.getElementById("cropper").classList.add("d-none");
        this.deleteImg()
    });
  };

  deleteImg = () => {
      this.setState({croppedImages: {}, croppedIds: 0})
      this.setState({workingPicturePath: 'flores.jpg'})
  }

  exportToPdf = () => {
      const pdf = new jsPDF({
          unit: "px",
      });
      pdf.addImage(this.state.images.pop().dataUrl, "JPEG", 0, 0);
      this.state.images.forEach( imgData => {
          pdf.addPage('a4', imgData.orientation)
          pdf.addImage(imgData.dataUrl, "JPEG", 0, 0);
      })
      pdf.save("download.pdf");
      // pdf.output('dataurlnewwindow');

  }

  refresh = () => {
      this.refs.cropper.reset()
  }


  click = () => {
      //this.state.publicFiles = []
      //this.state.workingPicturePath = ''
      //this.state.croppedImages = {}
       // this.refs.cropper.move(1);
    }

  render() {
    return (
        <div id="main-page">
      <div id="container">
          <div id={'cropper'}>
        {this.state.workingPicturePath && (
          <Cropper
            ref="cropper"
            src={this.state.workingPicturePath}
            style={{ height: 300, width: "100%" }}
            rotatable
            guides={false}
          />
        )}
          </div>
        <hr />
        <div className={'row horizontal-center'}>

          <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.selectPictures}><i className={'la la-cloud-upload'}></i> Mis fotos</button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.selectBackgrouds}><i className={'la la-image'}></i></button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.selectEmojis}><i className={'la la-smile-o'}></i></button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.cropImage}><i className={'la la-cut'}></i></button>
          <button className={'btn btn-outline-info btn-sm btn-margin'} disabled={this.state.croppedIds > 0} onClick={this.toggleFrameMode}>
                {<i className={ (this.state.frameMode === PORTRAIT)? 'la la-toggle-right': 'la la-toggle-down'}></i>}
                { (this.state.frameMode === PORTRAIT)? '':''}
          </button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.rotateRight}><i className={ 'la la-rotate-right'}></i></button>
          <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.rotateLeft}><i className={ 'la la-rotate-left'}></i></button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.refresh}><i className={ 'la la-refresh'}></i></button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.deleteImg}><i className={ 'la la-trash'}></i> </button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} disabled={this.state.croppedIds == 0} onClick={this.saveImg}><i className={ 'la la-save'}></i> </button>
            <button className={'btn btn-outline-info btn-sm btn-margin'} disabled={this.state.images.length == 0} onClick={this.exportToPdf}><i className={'la la-download '}> </i></button>
        </div>
        <hr />

        <div id="album-page-container">
          <div id="album-page-view" style={{heigth: '100%'}}>
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
        </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Demo />, rootElement);
