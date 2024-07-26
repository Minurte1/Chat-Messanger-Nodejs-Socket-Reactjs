import { useContext, useEffect } from "react";
import { SocketContext } from "../Context";

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
    let newWindow = null; // Khai báo biến newWindow ở đây

    useEffect(() => {
        if (stream) {
            newWindow = window.open("", "_blank", "width=800,height=600");
            if (newWindow) {
                newWindow.document.title = "Video Call";
                newWindow.document.body.innerHTML = `
                    <h1>${name || 'Name'}</h1>
                    <p>àugasfui</p>
                      <video playsInline ref={userVideo} autoPlay width="100%" />
                 <video playsInline muted ref={myVideo} autoPlay width="100%" />
                    <script>
                        const remoteVideo = document.getElementById('remoteVideo');
                        // Đợi video được tải và thiết lập stream
                        remoteVideo.onloadedmetadata = () => {
                            // Gửi message đến tab chính để nhận stream
                            window.opener.postMessage('getStream', '*');
                        };
                    </script>
                `;
            }
        }
    }, [stream, name]);

    useEffect(() => {
        const handleStreamMessage = (event) => {
            if (event.data.stream && event.data.stream instanceof MediaStream) {
                const remoteVideo = newWindow.document.getElementById('remoteVideo');
                remoteVideo.srcObject = event.data.stream; // Thiết lập srcObject cho video
            }
        };

        window.addEventListener('message', handleStreamMessage);

        return () => {
            window.removeEventListener('message', handleStreamMessage);
        };
    }, []);

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
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
