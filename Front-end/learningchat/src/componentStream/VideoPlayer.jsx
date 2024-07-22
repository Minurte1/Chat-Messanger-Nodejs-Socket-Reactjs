import { useContext } from "react";
import { SocketContext } from "../Context";

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                {/* my video */}
                {stream && (
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{name || 'Name'}</h5>
                                <video playsInline muted ref={myVideo} autoPlay width="100%" />
                            </div>
                        </div>
                    </div>
                )}
                {/* user's video */}
                {callAccepted && !callEnded && (
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{call.name || 'Name'}</h5>
                                <video playsInline ref={userVideo} autoPlay width="100%" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
