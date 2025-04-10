import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetection = ({ onEmotionDetected, stopVideoRef }) => {
  const videoRef = useRef(); // Reference to the video element
  const canvasRef = useRef(); // Reference to the canvas element
  const intervalRef = useRef(); // Reference to store the interval ID
  const streamRef = useRef(); // Reference to store the video stream

  // Function to load Face API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        startVideo(); // Start webcam after models are loaded
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  // Function to start the webcam stream
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        streamRef.current = stream; // Store the stream reference
        videoRef.current.srcObject = stream; // Attach the webcam stream to the video element
      })
      .catch((err) => console.error('Error accessing webcam:', err));
  };

  // Function to stop the webcam stream
  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks of the stream
    }
  };

  // Detect faces and draw bounding boxes
  const detectFace = async () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
      return; // Stop detection if video is not ready
    }

    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas is not available');
      return;
    }

    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // Log the detected emotions
    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      // console.log('expressions:', expressions);
    
      // Create a list of tuples (emotion, confidence, timestamp)
      const emotionTuples = Object.entries(expressions).map(([emotion, confidence]) => [emotion, confidence, Date.now()]);
    
      // console.log('Emotion tuples:', emotionTuples);
    
      // Sort the emotion tuples based on confidence in descending order
      const sortedEmotionTuples = emotionTuples.sort((a, b) => b[1] - a[1]);
    
      // Create a list of emotion strings ordered by confidence
      // const orderedEmotions = sortedEmotionTuples.map(tuple => tuple[0]);
    
      // console.log('Ordered emotions based on confidence:', orderedEmotions);
    
      // Get the emotion with the highest confidence
      // const [emotion, confidence] = sortedEmotionTuples[0];
    
      // console.log('FaceDetection current emotion:', emotion, 'with confidence:', confidence);
    
      // Trigger the callback if provided
      if (onEmotionDetected) {
        onEmotionDetected(sortedEmotionTuples); // Pass both emotion and confidence to the callback
      }
    }
  };

  // Detect faces every 100 milliseconds
  useEffect(() => {
    const handlePlay = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(detectFace, 100);
      }
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener('play', handlePlay);

    // Pass stopVideo function back to parent through ref
    if (stopVideoRef) {
      stopVideoRef.current = stopVideo;
    }

    return () => {
      clearInterval(intervalRef.current); // Cleanup interval on unmount
      intervalRef.current = null;
      videoElement?.removeEventListener('play', handlePlay);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} autoPlay muted width="480" height="270" style={{ position: 'relative' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0 }} />
    </div>
  );
};

export default FaceDetection;
