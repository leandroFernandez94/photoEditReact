import React from "react";
import { SketchPicker } from 'react-color';

class TextModalContent extends React.Component {
    textP
    componentDidMount() {

    }

    render() {
        return (

            <div id="modal-import-container">
                <h5> Texto :</h5>

                <div className="row">
                    <form style={{padding: '30px'}} className="row" >
                        <div className={'col-8'}>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Texto:</label>
                                <input type="text" className="form-control" onChange={evt => this.props.saveText(evt.target.value, 'texto')} placeholder="Mi texto"/>
                            </div>
                            <div className="form-group">
                                <label >Tamaño de letra:</label>
                                <input type="number" className="form-control" onChange={evt => {evt.target.value = Math.min(evt.target.value, 50); this.props.saveText(evt.target.value +'px', 'size')}} placeholder="12"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleSelect1">Tipografia:</label>
                                <select className="form-control" id="exampleSelect1" onChange={evt => this.props.saveText(evt.target.value, 'font')}>

                                    <option value="Roboto" className="Roboto">Roboto</option>
                                    <option value="Lato" className="Lato">Lato</option>
                                    <option value="Shadows" className="Shadows">Shadows</option>
                                    <option value="OldStandardTT" className="OldStandardTT">Old Standard TT</option>
                                    <option value="AbrilFatface" className="AbrilFatface">Abril Fatface</option>
                                    <option value="OleoScript" className="OleoScript">Oleo Script Swash Caps</option>
                                    <option value="PT Mono" className="PT Mono">PT Mono</option>
                                    <option value="Charmonman" className="Charmonman">Charmonman</option>
                                    <option value="GreatVibes" className="GreatVibes">Great Vibes</option>
                                    <option value="AmaticSC" className="AmaticSC">Amatic SC</option>
                                    <option value="Tangerine" className="Tangerine">Tangerine</option>
                                    <option value="Charmonman" className="Charmonman">Charmonman</option>
                                    <option value="Fredoka One" className="FredokaOne">Fredoka One</option>
                                    <option value="Monoton" className="Monoton">Monoton</option>
                                </select>
                            </div>
                        </div>
                        <div className={'col-4'}>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Color:</label>
                                <SketchPicker
                                    color={ this.props.texto.color || 'black' }
                                    onChangeComplete={ color => this.props.saveText(color.hex, 'color') }
                                />
                            </div>
                        </div>

                        <div className="form-group col-12">
                            <label htmlFor="exampleSelect1">Previsualizacion:</label>
                            <div className="row" style={{display: 'contents'}}>
                                <div style={{minWidth:500, minHeight: 100, border: '1px solid grey', padding: '20px'}}>
                                    <p className={this.props.texto.font} style={{ fontSize: this.props.texto.size, color: this.props.texto.color, display: 'inline-block'}} ref = {c => this.textP = c}> {this.props.texto.texto}</p>
                                </div>
                            </div>
                        </div>

                    </form>


                </div>
                <div className="row horizontal-center">
                        <button className="btn btn-outline-info btn-sm btn-margin" onClick={() => this.props.agregarTexto(this.textP.clientHeight+1, this.textP.clientWidth+1)}>Generar</button>
                </div>

            </div>
        );
    }
}

export default TextModalContent;