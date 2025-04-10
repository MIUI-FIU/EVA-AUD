import ReactDOMClient from 'react-dom/client';
import React, { useRef } from 'react';
import FaceDetection from '../components/FaceDetection';

let root = null;
let stopVideoRef = null; // Reference to store stopVideo function

export const start = (animationManager, settings, containerRef) => {
  if (!containerRef || !containerRef.current) {
    console.error('Container reference not provided or invalid. Unable to start FaceDetectionApp.');
    return;
  }

  if (!root) {
    root = ReactDOMClient.createRoot(containerRef.current);
  }

  // Callback function to handle detected emotions
  const handleEmotionDetected = (sortedEmotionsTuples) => {
    console.log('Detected sortedEmotionsTuples:', sortedEmotionsTuples);

    let topEmotionTuple = sortedEmotionsTuples[0]

    console.log('Top Emotion Tuple:', topEmotionTuple)
  };

  // Create a ref to pass to FaceDetection for stopping video
  stopVideoRef = React.createRef();

  root.render(
    <FaceDetection
      animationManager={animationManager}
      settings={settings}
      onEmotionDetected={handleEmotionDetected}
      stopVideoRef={stopVideoRef} // Pass the stopVideoRef to FaceDetection
    />
  );
};

export const stop = () => {
  if (stopVideoRef && stopVideoRef.current) {
    stopVideoRef.current(); // Call stopVideo from FaceDetection
  }

  if (root) {
    root.unmount();
    root = null;
  }
};