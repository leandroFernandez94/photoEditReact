import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from 'react-router-dom'
import Modal from "react-responsive-modal";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css';
import './line-awesome/css/line-awesome.min.css'

import ImportModalContent from "./ImportModalContent";
import CropperModalContent from './CropperModal'
import AlbumPageContainer from "./AlbumPageContainer";
import TextModalContent from './textModalContent'


import {getBackgrounds, getEmoticones, getPublicFiles} from "./FilesService";
import {
    LANDSCAPE,
    PORTRAIT,
    LANDSCAPE_WIDTH,
    LANDSCAPE_HEIGHT,
    A4_SCALE,
    PORTRAIT_WIDTH,
    PORTRAIT_HEIGHT, MARGEN
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
      textModal: false,
      cropperModal: false,
    workingPicturePath: 'flores.jpg',
    croppedIds: 0,
      primerImagen: 0,
      textos: [],
      texto:{}
  };

  componentWillMount() {
    getPublicFiles().then(files => this.setState({ publicFiles: files }));
  }

    agregarTexto = (height, width, coso) => {
      console.log('ACA', coso)
      console.log('textos', this.state.textos)
        console.log('texto', this.state.texto)
        let texto = {}
        texto.texto = this.state.texto.texto
        texto.size = this.state.texto.size
        texto.font = this.state.texto.font
        texto.color = this.state.texto.color
        texto.width = width
        texto.height = height
        texto.top = 50
        texto.left = 50
        texto.id= this.state.croppedIds
        this.setState({croppedIds: ++this.state.croppedIds})
        this.setState(prevState => ({
            textos: [...prevState.textos, texto]
        }))
        console.log(this.state.textos)
        this.setState(prevState => ({ textModal: !prevState.textModal }));
    }

    saveText = (value, field) => {
      let t = this.state.texto
        t[field] = value
      this.setState({texto: t})
        console.log(this.state.texto)
    }


  

  toggleFrameMode = () => {

      /*for( let i=0; i<this.state.croppedIds; i++){
          let width = Math.min(this.state.croppedImages[i].width, 396)
          this.handleImageResize( {key: i.toString(), width: width +'px', height: this.state.croppedImages[i].height +'px', x: 0, y: this.state.croppedImages[i].top})
      }*/
      this.setState(({ frameMode}) => ({
          frameMode: frameMode === PORTRAIT ? LANDSCAPE : PORTRAIT,
      }));

  };

  cropImage = (canvas) => {
      const dataUrl = canvas.toDataURL();
      const {
          width,
          height
      } =
      this.state.frameMode === LANDSCAPE ?
          calculateLandscapeMeazures(canvas.width, canvas.height) :
          calculatePortraitMeazures(canvas.width, canvas.height);

      console.log(width, height);
      this.setState(
          ({
              croppedImages,
              croppedIds
          }) => ({
              //croppedImages: [...croppedImages, dataUrl]
              croppedImages: {
                  ...croppedImages,
                  [this.state.croppedIds]: {
                      id: this.state.croppedIds,
                      path: dataUrl,
                      top: 10,
                      left: 10,
                      width: width,
                      height: height,
                      type: 'img'
                  }
              },
              croppedIds: croppedIds + 1
          }),
          () => console.log(this.state)
      );
      this.onCloseModalCropper()
  };

  onOpenModal = () => {
    this.setState(prevState => ({ importModal: !prevState.importModal }));
  };

  onOpenModalCropper = () => {
      this.setState(prevState => ({
          cropperModal: !prevState.cropperModal
      }));
  };
   onCloseModalCropper = () => {
       this.setState(prevState => ({
           cropperModal: !prevState.cropperModal
       }));
   };

    onOpenModal = () => {
        this.setState(prevState => ({ importModal: !prevState.importModal }));
    };

    onCloseModal = () => {
        this.setState(prevState => ({ importModal: !prevState.importModal }));
        
    };

    onOpenModalText = () => {
        this.setState(prevState => ({ textModal: !prevState.textModal }));
    };

    onCloseModalText = () => {
        this.setState(prevState => ({ textModal: !prevState.textModal }));
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
        let type = (imgPath.includes('fondo'))? 'fondo': (imgPath.includes('emoji'))? 'emoji': null
        if( type === 'fondo' || type === 'emoji'){
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            let cargarImagen = (dataUrl, canvas) => {
                //const dataUrl = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                const { width, height } =
                    this.state.frameMode === LANDSCAPE
                        ? calculateLandscapeMeazures(canvas.width, canvas.height)
                        : calculatePortraitMeazures(canvas.width, canvas.height);
                this.setState(
                    ({ croppedImages, croppedIds }) => ({
                        croppedImages: {
                            ...croppedImages,
                            [this.state.croppedIds]: {
                                id: this.state.croppedIds,
                                path: dataUrl,
                                top: (type==='fondo')? 0: MARGEN,
                                left: (type==='fondo')? 0: MARGEN,
                                width: width,
                                height: height,
                                type: type
                            }
                        },
                        croppedIds: croppedIds + 1
                    }), this.onCloseModal
                )
            }
            img.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width =this.width;
                canvas.height =this.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);
                var dataURL = canvas.toDataURL("image/png");

                cargarImagen(dataURL, canvas)
            };
            img.src = imgPath;

        }else{
            this.setState(prevState => ({
                workingPicturePath: imgPath,
                cropperModal: !prevState.cropperModal
            }), this.onCloseModal);
        }

  };

  handleImageMove = (key, left, top) => {
      console.log(key, left, top)
      let img = this.state.croppedImages[key]
      let bottom = LANDSCAPE_HEIGHT - (top + img.height)
      let right = LANDSCAPE_WIDTH - (left + img.width)
      if(img.type !== 'fondo'){
          left = (left < MARGEN)? MARGEN : (right < MARGEN)? LANDSCAPE_WIDTH-(img.width +MARGEN) : left
          top = (top < MARGEN)? MARGEN : (bottom < MARGEN)? LANDSCAPE_HEIGHT-(img.height +MARGEN) : top
      }
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

  handleTextMove = (index, left, top) =>{
      let textos2 =this.state.textos
      let bottom = LANDSCAPE_HEIGHT - (top + textos2[index].height)
      let right = LANDSCAPE_WIDTH - (left + textos2[index].width)
       textos2[index].left = (left < MARGEN)? MARGEN : (right < MARGEN)? LANDSCAPE_WIDTH-(textos2[index].width +MARGEN) : left
      textos2[index].top = (top < MARGEN)? MARGEN : (bottom < MARGEN)? LANDSCAPE_HEIGHT-(textos2[index].height +MARGEN) : top
      this.setState(({textos})=> ({textos2}))
      console.log(this.state.textos[index])
  }

    handleTextResize = ({key, width, height, ...position}) => {
        let textos2 =this.state.textos
        textos2[key].width = width
        textos2[key].height = height
        textos2[key].left = position.x
        textos2[key].top = position.y
        this.setState(({textos})=> ({textos2}))
        console.log(this.state.textos[key])
    };


  handleImageResize = ({key, width, height, ...position}) => {
      let img = this.state.croppedImages[key]
      let bottom = LANDSCAPE_HEIGHT - (top + img.height)
      let right = LANDSCAPE_WIDTH - (left + img.width)
      let left= position.x
      let top= position.y
      width = Number(width.split('p')[0])
      height = Number(height.split('p')[0])
      if(img.type !== 'fondo'){
          left = (left < MARGEN)? MARGEN : (right < MARGEN)? LANDSCAPE_WIDTH - (img.width +MARGEN) : left
          top = (top < MARGEN)? MARGEN : (bottom < MARGEN)? LANDSCAPE_HEIGHT - (img.height +MARGEN) : top
          let aspect = img.width/ img.height
          if(width > LANDSCAPE_WIDTH-MARGEN*2){
              width = LANDSCAPE_WIDTH - MARGEN*2
              height = width/aspect
          }
          if(height > LANDSCAPE_HEIGHT-MARGEN*2){
              height = LANDSCAPE_HEIGHT - MARGEN*2
              width = height*aspect
          }
      }
      console.log('ACA',width, height)
    this.setState(({ croppedImages }) => ({
      croppedImages: {
        ...croppedImages,
        [key]: {
          ...croppedImages[key],
          left: left,
          top: top,
          width: width,
            height: height
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
      this.setState({textos: []})
      this.setState({workingPicturePath: 'flores.jpg'})
  }

  reverseImg = () => {
      let images = this.state.croppedImages
      let textos = this.state.textos
      let ultimoId = --this.state.croppedIds
      delete images[ultimoId.toString()]
      textos = textos.filter(t => t.id != ultimoId)
      this.setState({croppedImages: images, textos: textos, croppedIds: Math.max(ultimoId, 0)})
  }

  deleteOneImg = (i) => {
      let images2 = this.state.images
      images2.splice(i,1)
      this.setState(({images}) => ({images: images2}))
  }

  exportToPdf = () => {
      const pdf = new jsPDF({
          unit: "mm",
          orientation: 'landscape',
          format: [200,300]
      });
     // pdf.addPage('a4', this.state.images[0].orientation)
      pdf.addImage(this.state.images.pop().dataUrl, "JPEG", 0, 0, 300, 200);
      this.state.images.forEach( imgData => {
          pdf.addPage('mm', [200,300])
          pdf.addImage(imgData.dataUrl, "JPEG", 0, 0, 300, 200);
      })
      pdf.save("download.pdf");
      this.setState(({images}) => ({images: []}))
      // pdf.output('dataurlnewwindow');

  }

  refresh = () => {
      this.refs.cropper.reset()
  }


  avanzarImagen = () => {
      let primer = ++this.state.primerImagen
      this.setState({ primerImagen: primer})
  }

    retrocederImagen = () => {
      let primer = --this.state.primerImagen
        this.setState({ primerImagen: primer })
    }

/*<button className={'btn btn-outline-info btn-sm btn-margin'} disabled={this.state.croppedIds > 0} onClick={this.toggleFrameMode}>
{<i className={ (this.state.frameMode === PORTRAIT)? 'la la-toggle-right': 'la la-toggle-down'}></i>}
{ (this.state.frameMode === PORTRAIT)? '':''}
</button>*/
  render() {
    return (
        <div id="main-page">
            <div id="main-container" >


                     <div id="side-pictures-container">
                         <button className={'btn btn-outline-info btn-sm btn-margin'} disabled={this.state.primerImagen == 0} onClick={this.retrocederImagen}>
                             <i className="la la-angle-up"></i>
                         </button>

                             {this.state.images.map((image, i)=> {
                                 return <div style={{position: 'relative'}} key={i}>
                                         <img style={{maxWidth: '90%', border: '1px solid #00000021', margin: '5px'}} srcSet={image.dataUrl} alt=""  />
                                     <button className={'btn btn-danger btn-sm'} style={{position: 'absolute', top: '8px', right: '11px'}} title="Eliminar imagen" onClick={() => this.deleteOneImg(i)}><i className={'la la-close'}></i> </button>
                                 </div>;
                             }).filter((_, i) => this.state.primerImagen <= i  && i < this.state.primerImagen +6)}

                             <button style={{position: 'absolute', bottom: '40px',left: '40%'}} className={'btn btn-outline-info btn-sm btn-margin'} disabled={this.state.primerImagen >= this.state.images.length - 6} onClick={this.avanzarImagen}>
                                 <i className="la la-angle-down"  ></i>
                             </button>

                     </div>

                        <div id="container">
                        <hr/>

                            <div style = {{textAlign: 'center'}} >
                             < h5 className={"Raleway"} style={{color: '#4da6c7'}}> Agregar imagen</h5>
                             </div>

                            <div className={'row horizontal-center'}>

                                <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.selectPictures} title={"Agregar una nueva foto"}><i className={'la la-cloud-upload'}></i> Fotos</button>
                                <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.selectBackgrouds} title={"Agregar un fondo"}><i className={'la la-image'}></i>Fondos</button>
                                <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.selectEmojis} title={"Agregar un emoji"}><i className={'la la-smile-o'}></i>Emojis</button>
                                <button className={'btn btn-outline-info btn-sm btn-margin'} onClick={this.onOpenModalText} title={"Agregar texto"}><i className={ 'la la-pencil'}></i> Texto</button>
                            </div>
                        <hr />

                            

                            <div id="album-page-container">

                                <div id="album-page-view" style={{heigth: '100%'}}>

                                    <div id="album-page-separator" className={ this.state.images.length > 0 ? '' : 'hidden'}>
                                    </div>
                                        <div id="front-back-separator-right" className={ this.state.images.length <= 0 ? '' : 'hidden' }>
                                            <p>Tapa</p>
                                        </div>
                                        <div id="front-back-separator-left" className={ this.state.images.length <= 0 ? '' : 'hidden'}>
                                            <p>Contratapa</p>
                                        </div>


                                    <AlbumPageContainer
                                        frameMode={this.state.frameMode}
                                        croppedImages={this.state.croppedImages}
                                        textos={this.state.textos}
                                        handleImageMove={this.handleImageMove}
                                        handleTextMove={this.handleTextMove}
                                        handleImageResize={this.handleImageResize}
                                        handleTextResize={this.handleTextResize}
                                    />

                                </div>
                            </div>
                            <hr/>
                                <div className = {'row horizontal-center'} >
                                <button className = {'btn btn-outline-info btn-sm btn-margin'}
                                    onClick = {this.reverseImg}
                                    title = {"Borrar ultima imagen agregada"} > 
                                    < i className = {'la la-refresh'} > </i>Revertir cambios
                                </button >
                                <button className = {'btn btn-outline-info btn-sm btn-margin' }
                                    disabled = {this.state.croppedIds == 0}
                                    onClick = {this.saveImg}
                                    title = {"Guardar imagen y pasar a la siguiente hoja" } > 
                                    < i className = {'la la-save'} > </i> Guardar pagina
                                </button >
                                <button className = {'btn btn-outline-info btn-sm btn-margin'}
                                    disabled = {this.state.images.length == 0}
                                    onClick = {this.exportToPdf}
                                    title = {"Exportar imagenes como pdf"} > 
                                    < i className = {'la la-download '} > </i>Exportar libro
                                </button >
                                </div> 
                                <hr/>
                            <Modal open={this.state.cropperModal} onClose={this.onCloseModalCropper} center>
                                <CropperModalContent
                                    cropImage={this.cropImage}
                                    state={this.state}
                                />
                            </Modal>
                            <Modal open={this.state.importModal} onClose={this.onCloseModal} center>
                                <ImportModalContent
                                    publicFiles={this.state.publicFiles}
                                    onImgPick={this.handleImgPick}
                                />
                            </Modal>
                            <Modal open={this.state.textModal} onClose={this.onCloseModalText} center>
                                <TextModalContent
                                    texto={this.state.texto}
                                    saveText={this.saveText}
                                    agregarTexto={this.agregarTexto}
                                />
                            </Modal>
                        </div>
            </div>


        </div>
    );
  }



}

const rootElement = document.getElementById("root");
ReactDOM.render(<HashRouter path="/home"><Demo /></HashRouter>, rootElement);
