import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";

const SocketContext = createContext();
const socket = io("http://localhost:3001");

const ContextProvider = ({ children }) => {
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [name, setName] = useState("");
  const [me, setMe] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // useEffect(() => {
  //   socket.on("me", (id) => {
  //     console.log("Received 'me' event: ", id);
  //     setMe(id);
  //   });

  //   socket.on("callUser", ({ from, name: callerName, signal }) => {
  //     console.log("Received 'callUser' event: ", { from, callerName, signal });
  //     setCall({ isReceivingCall: true, from, name: callerName, signal });
  //   });

  //   return () => {
  //     socket.off("me");
  //     socket.off("callUser");
  //   };
  // }, []);

  useEffect(() => {
    socket.on("me", (id) => setMe(id));
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  console.log("call ->", call);

  const getMediaStream = async (isVideo = true, isAudio = true) => {
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
      console.log("check id socket Friend =>", response.data.idVideoMe);
      callUser(response.data.idVideoMe);
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
        handleCallFriend,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
