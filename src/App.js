import './App.css';
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

function App() {

  const canvasRef = useRef(null)
  const webcamRef = useRef(null)

  return (
    <div className="App">
      <Webcam ref={webcamRef} style={
        {
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 600,
          height: 420
        }
      } />
      <canvas ref={canvasRef} style={
        {
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 600,
          height: 420
        }
      }>
      </canvas>
    </div>
  );
}

export default App;
