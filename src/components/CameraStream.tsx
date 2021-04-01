import React, {useState, useRef,RefObject} from 'react';
import axios from 'axios'
import ReactDOM from 'react-dom';
let pc:RTCPeerConnection;
let count:number=0;
let videoRef:any;
let btnTakePic:any;
let canvasElement:any;

let doSignaling = (iceRestart:any) => {
    console.log({iceRestart});
    if(count==0){
    pc.createOffer({iceRestart})
        .then(offer => {
            console.log(offer);
            pc.setLocalDescription(offer)

            return axios.post(`http://localhost:8080/doSignaling`,JSON.stringify(offer));
        })
        .then(res => res.data)
        .then(res => {pc.setRemoteDescription(res); console.log(res)})
       // .catch(alert)
    }
    count++;
}
export class MyComponent extends React.Component<any, any> {
    

    componentDidMount(){
        pc = new RTCPeerConnection()
        pc.addTransceiver('video')
       
        pc.oniceconnectionstatechange = () => console.log(pc.iceConnectionState);
        pc.ontrack = function (event) {
            let el =document.createElement('video') as HTMLVideoElement;
            el.srcObject = event.streams[0];
            el.autoplay = true
            el.controls = true;
            const rootElement = document.getElementById("remoteVideos");
            ReactDOM.render(<video ref={audio => {videoRef = audio}} controls={true} autoPlay={true} style={{height:400}}></video>, rootElement);
            videoRef.srcObject=event.streams[0];
        }
        doSignaling(false);
    }
    constructor(props: any) {
        super(props);
        videoRef = React.createRef();
        btnTakePic=React.createRef();

    }
    takePic(){
        const video = videoRef;
        ReactDOM.render(<canvas ref={canvas=>canvasElement=canvas} style={{height:400}}></canvas>, document.getElementById("canvas"));
        // scale the canvas accordingly
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        // draw the video at that frame
        canvasElement.getContext('2d')
        .drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        // convert it to a usable data URL
        const dataURL = canvasElement.toDataURL();
        console.log(dataURL);
    }
      render() {
        return (
            <div>
                <h3><a href="index.html">Video</a></h3>
                <div id="remoteVideos">
                </div>
                <button onClick={this.takePic} ref={btnPic=>{btnTakePic=btnPic}}>Take Picture</button>
                <div id="canvas"></div>
                <h3> Logs </h3>
                <div id="logs"></div>
            </div>
            );
      }
}