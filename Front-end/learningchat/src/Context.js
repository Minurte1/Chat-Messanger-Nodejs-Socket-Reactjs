import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import axios from "axios";
const SocketContext = createContext();
const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(true); // Trạng thái camera mặc định là bật

  useEffect(() => {
    socket.on("me", (id) => setMe(id));
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const getMediaStream = async (isVideo = true, isAudio = true) => {
    // Thêm mặc định là true cho isVideo và isAudio
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: isAudio,
      });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
      return currentStream;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };
  const handleGetMediaStream = async () => {
    try {
      if (isCameraOn) {
        try {
          const currentStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
          return currentStream;
        } catch (error) {
          console.error("Error accessing media devices.", error);
        }
      } else {
        try {
          const currentStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: false,
          });
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
          return currentStream;
        } catch (error) {
          console.error("Error accessing media devices.", error);
        }
      }
      setIsCameraOn(!isCameraOn); // Đảo ngược trạng thái camera sau khi thực hiện thành công
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };
  const answerCall = async () => {
    setCallAccepted(true);
    const currentStream = await getMediaStream();
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = async (id) => {
    const currentStream = await getMediaStream();
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentStream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };
  const handleCallFriend = async (id_Friend) => {
    console.log("id_Friend", id_Friend);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/messages/call",
        {
          id_Friend: id_Friend,
        }
      );
      console.log("check id socket Friend =>", response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        getMediaStream,
        isCameraOn,
        handleGetMediaStream,

        handleCallFriend,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
