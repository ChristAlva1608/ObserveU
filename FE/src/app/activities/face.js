import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

const WebcamThrottlingChecker = () => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('Page is inactive. Checking webcam access...');
        checkWebcamAccess();
      } else {
        console.log('Page is active.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkWebcamAccess = () => {
    if (!webcamRef.current) return;

    try {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          console.log('Webcam access successful.');
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
        });
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  return (
    <div>
      <h1>Webcam Throttling Checker</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
    </div>
  );
};

export default WebcamThrottlingChecker;
