import './App.css';
import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs-backend-webgl'

function App() {

  const canvasRef = useRef(null)
  const webcamRef = useRef(null)

  const runFacemash = async () => {

    await tf.setBackend("webgl");
    await tf.ready();

    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    const detectorConfig = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      enableSimd: true
    }
    const net = await faceLandmarksDetection.createDetector(model, detectorConfig)
    
    setInterval(() => {
      detect(net)
    }, 100)
  }

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const faces = await net.estimateFaces(video)
      console.log(faces)

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

      if (faces.length > 0) {
        faces.forEach((face) => {
          const keypoints = face.keypoints;

          keypoints.forEach((keypoint) => {
            const [x, y] = [keypoint.x, keypoint.y];
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'aqua'
            ctx.fill();
          });
        });
      }
    }
  }

  useEffect(() => {
    runFacemash()
  })

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
