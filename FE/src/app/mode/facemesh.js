import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as Facemesh from "@mediapipe/face_mesh";
import * as HandLandmarker from "@mediapipe/tasks-vision";
import * as cam from "@mediapipe/camera_utils";
import PropTypes from "prop-types";
// import { usestartSession } from "../useData";


const LEFT_EYE_TOP_BOTTOM = [386, 374];
const LEFT_EYE_LEFT_RIGHT = [263, 362];
const RIGHT_EYE_TOP_BOTTOM = [159, 145];
const RIGHT_EYE_LEFT_RIGHT = [133, 33];


let notificationTimeout;
let isNotificationShowing = false;
let inFrame = true;

function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}

function showNotification(title, message, duration, setStartSession) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications");
  } else if (Notification.permission === "granted") {
    if (!isNotificationShowing) {
      const notification = new Notification(title, { body: message });
      console.log(typeof setStartSession)
      if (typeof setStartSession === "function") {
        if(title == "Drowsy"){
          setStartSession((prev) => {
            return [...prev, { message: "You are sleepy", time: new Date() }];
          });
        }
        else if (title == "Next"){
        setStartSession((prev) => {
          return [...prev, { message: "Move to next song", time: new Date() }];
        });
        }
        else if (title == "Back"){
        setStartSession((prev) => {
          return [...prev, { message: "Move to previous song", time: new Date() }];
        });
        }
        else if (title == "Stop"){
        setStartSession((prev) => {
          return [...prev, { message: "Play/pause song", time: new Date() }];
        });
        }
        else if (title == "Leave"){
        setStartSession((prev) => {
          return [...prev, { message: "You left workspace", time: new Date() }];
        });
        }
        else if (title == "In"){
        setStartSession((prev) => {
          return [...prev, { message: "You back to workspace", time: new Date() }];
        });
        }
      }
      isNotificationShowing = true;


      notificationTimeout = setTimeout(() => {
        notification.close();
        isNotificationShowing = false;
      }, duration);
    }
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        if (!isNotificationShowing) {
          const notification = new Notification(title, { body: message });
          isNotificationShowing = true;


          notificationTimeout = setTimeout(() => {
            notification.close();
            isNotificationShowing = false;
          }, duration);
        }
      }
    });
  }
}


function detectDrowsiness(faceMeshResults, setStartSession) {
  if (!faceMeshResults || !faceMeshResults[0]) return; // No face detected


  const landmarks = faceMeshResults[0]; // Assuming only one face is detected


  const leftEyeAspectRatio = calculateAspectRatio(
    landmarks,
    LEFT_EYE_TOP_BOTTOM,
    LEFT_EYE_LEFT_RIGHT
  );
  const rightEyeAspectRatio = calculateAspectRatio(
    landmarks,
    RIGHT_EYE_TOP_BOTTOM,
    RIGHT_EYE_LEFT_RIGHT
  );
  const averageAspectRatio = (leftEyeAspectRatio + rightEyeAspectRatio) / 2;


  // Define a threshold for drowsiness detection
  const drowsinessThreshold = 3.0; // Adjust as needed
  // console.log(averageAspectRatio)
  if (averageAspectRatio > drowsinessThreshold) {
    return 1;
  } else return 0;
}


const calculateAspectRatio = (landmarks, topbot, leftright) => {
  const top = landmarks[topbot[0]];
  const bot = landmarks[topbot[1]];
  const left = landmarks[leftright[0]];
  const right = landmarks[leftright[1]];
  const horizontalDistance = calculateDistance(left, right); // Horizontal distance
  const verticalDistance = calculateDistance(top, bot); // Vertical distance
  const aspectRatio = horizontalDistance / verticalDistance;
  return aspectRatio;
};


const calculateDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};


function detectGesture(handLandmarkerResults, setStartSession) {
  //check next or back
  if (!handLandmarkerResults[0]) return;
  let handlandmarks = handLandmarkerResults[0];
  const top = handlandmarks[8];
  const rear = handlandmarks[5];
  const tan = (top.x - rear.x) / Math.abs(top.y - rear.y);
  const fin1 = [handlandmarks[8], handlandmarks[5]];
  const fin2 = [handlandmarks[12], handlandmarks[9]];
  const fin3 = [handlandmarks[16], handlandmarks[13]];
  const fin4 = [handlandmarks[20], handlandmarks[17]];
  if (tan < -5) {
    showNotification("Next", "Move to next song", 3000, setStartSession);
    console.log("next");
    // setStartSession((prev) => {
    //   return [...prev, { message: "Move to next song", time: new Date() }];
    // });
  } else if (tan > 5) {
    showNotification("Back", "Move to previous song", 3000, setStartSession);
    console.log("back");
    // setStartSession((prev) => {
    //   return [...prev, { message: "Move to previous song", time: new Date() }];
    // });
  }
  //check stop
  else if (
    fin1[0].y > fin1[1].y &&
    fin2[0].y > fin2[1].y &&
    fin3[0].y > fin3[1].y &&
    fin4[0].y > fin4[1].y &&
    fin1[0].y - fin2[0].y < 0.01 &&
    fin2[0].y - fin3[0].y < 0.01 &&
    fin3[0].y - fin4[0].y < 0.01
  ) {
    showNotification("Stop", "Play/pause song", 3000, setStartSession);
    console.log("stop");
    // setStartSession((prev) => {
    //   return [...prev, { message: "Stop the current song", time: new Date() }];
    // });
  }
}


const CombinedComponent = ({ setStartSession }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let faceMesh = null;
  let faceResult = null;
  let handLandmarker = null;
  let camera = null;
  let check = 0;


  useEffect(() => {
    const setupFaceMeshAndHandLandmarker = async () => {
      // Setup Face Mesh
      faceMesh = new Facemesh.FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });


      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });


      faceMesh.onResults(setFunc);


      async function setFunc(results) {
        faceResult = results.multiFaceLandmarks;
      }


      // Setup Hand Landmarker
      const vision = await HandLandmarker.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      handLandmarker = await HandLandmarker.HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          numHands: 2,
        }
      );


      if (webcamRef.current) {
        camera = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            // Face Mesh detection
            if (webcamRef.current && webcamRef.current.video)
              await faceMesh.send({ image: webcamRef.current.video });
            // Hand Landmark detection
            if (webcamRef.current && webcamRef.current.video) {
              const handResults = await handLandmarker.detect(
                webcamRef.current.video
              );
              onResults({ faceMeshResults: faceResult, handResults });
            }
          },
          width: 600,
          height: 400,
        });
        camera.start();
      }
    };


    setupFaceMeshAndHandLandmarker();


    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, []);


  const onResults = async ({ faceMeshResults, handResults }) => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");


    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;


    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;


    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      webcamRef.current.video,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (faceMeshResults && faceMeshResults.length == 0){
      if (inFrame == true){
        inFrame = false
        showNotification("Leave", "You left workspace", 1500, setStartSession);
      }
    }
    if (faceMeshResults && faceMeshResults.length != 0) {
      if (inFrame == false){
        inFrame = true;
        showNotification("In", "Back to work", 1500, setStartSession);
      }
      let tmp = detectDrowsiness(faceMeshResults);
      if (tmp == 0) {
        check = 0;
      } else {
        check = check + 1;
        if (check > 100) {
          showNotification("Drowsy", "Drowsiness Detected", 3000, setStartSession);
          console.log("sleepy");
          // setStartSession((prev) => {
          //   return [...prev, { message: "You are sleepy", time: new Date() }];
          // });
          playSound("/rest.mp3")


          check = 0;
        }
      }


      for (const landmarks of faceMeshResults) {
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#FF3030",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#FF3030",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#30FF30",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#30FF30",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }
    }


    if (handResults && handResults.landmarks) {
      // console.log(handResults.landmarks)


      detectGesture(handResults.landmarks, setStartSession);
      for (const landmarks of handResults.landmarks) {
        for (const point of landmarks) {
          const x = point.x * videoWidth;
          const y = point.y * videoHeight;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
          canvasCtx.fillStyle = "#FF0000";
          canvasCtx.fill();
        }
        canvasCtx.beginPath();
        canvasCtx.moveTo(
          landmarks[0].x * videoWidth,
          landmarks[0].y * videoHeight
        );
        for (let i = 1; i < landmarks.length; i++) {
          const x = landmarks[i].x * videoWidth;
          const y = landmarks[i].y * videoHeight;
          canvasCtx.lineTo(x, y);
        }
        canvasCtx.closePath();
        canvasCtx.strokeStyle = "#FF0000";
        canvasCtx.stroke();
      }
    }


    canvasCtx.restore();
  };


  const drawConnectors = (context, landmarks, connections, options) => {
    options = options || {};
    options.color = options.color || "white";
    options.lineWidth = options.lineWidth || 1;


    context.strokeStyle = options.color;
    context.lineWidth = options.lineWidth;


    for (const connection of connections) {
      const start = landmarks[connection[0]];
      const end = landmarks[connection[1]];


      context.beginPath();
      context.moveTo(
        start.x * canvasRef.current.width,
        start.y * canvasRef.current.height
      );
      context.lineTo(
        end.x * canvasRef.current.width,
        end.y * canvasRef.current.height
      );
      context.stroke();
    }
  };


  return (
    <center>
      <div className="App relative" style={{ height: "400px" }}>
        <Webcam
          ref={webcamRef}
          className="absolute mx-auto left-0 right-0 text-center z-10 w-[600px] h-[400px]"
        />
        <canvas
          ref={canvasRef}
          className="output_canvas absolute mx-auto left-0 right-0 text-center z-10 w-[600px] h-[400px]"
        ></canvas>
      </div>
    </center>
  );
};


export default CombinedComponent;