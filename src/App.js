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

    try {
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
    } catch (error) {
      console.error('Error initializing facemash', error)
    }
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
            ctx.arc(x, y, 2, 0, 1 * Math.PI);
            ctx.fillStyle = 'yellow'
            ctx.fill();
          });

          // drawAvatar(ctx, keypoints)
        });
      }
    }
  }

  // const drawAvatar = (ctx, keypoints) => {

  //   const leftEye = keypoints.slice(33, 133)
  //   const rightEye = keypoints.slice(362, 462)
  //   const mouth = keypoints.slice(13, 14)

  //   const leftEyeCenter = leftEye.reduce(
  //     (acc, point) => {
  //       acc.x += point.x / leftEye.length;
  //       acc.y += point.y / leftEye.length;
  //       return acc;
  //     },
  //     { x: 0, y: 0 }
  //   );

  //   const leftEyeGradient = ctx.createRadialGradient(
  //     leftEyeCenter.x,
  //     leftEyeCenter.y,
  //     5,
  //     leftEyeCenter.x,
  //     leftEyeCenter.y,
  //     20
  //   );
  //   leftEyeGradient.addColorStop(0, 'blue');
  //   leftEyeGradient.addColorStop(1, 'rgba(0, 0, 255, 0.5)');

  //   ctx.beginPath();
  //   ctx.ellipse(leftEyeCenter.x, leftEyeCenter.y, 20, 15, 0, 0, Math.PI * 2);
  //   ctx.fillStyle = leftEyeGradient;
  //   ctx.fill();

  //   ctx.beginPath();
  //   rightEye.forEach((point, index) => {
  //     const x = point.x;
  //     const y = point.y;
  //     if (index === 0) ctx.moveTo(x, y);
  //     else ctx.lineTo(x, y);
  //   });
  //   ctx.closePath();
  //   ctx.strokeStyle = 'lime';
  //   ctx.lineWidth = 3;
  //   ctx.stroke();

  //   mouth.forEach((point) => {
  //     const { x, y } = point;
  //     const radius = 15;
  //     const spikes = 5;
  //     const innerRadius = 7;

  //     ctx.beginPath();
  //     for (let i = 0; i < spikes * 2; i++) {
  //       const angle = (Math.PI / spikes) * i;
  //       const r = i % 2 === 0 ? radius : innerRadius;
  //       const xPos = x + r * Math.cos(angle);
  //       const yPos = y + r * Math.sin(angle);
  //       if (i === 0) ctx.moveTo(xPos, yPos);
  //       else ctx.lineTo(xPos, yPos);
  //     }
  //     ctx.closePath();
  //     ctx.fillStyle = 'red';
  //     ctx.fill();
  //     ctx.strokeStyle = 'darkred';
  //     ctx.lineWidth = 2;
  //     ctx.stroke();
  //   });
  // }

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
