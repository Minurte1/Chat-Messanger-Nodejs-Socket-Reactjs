import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SocketContext } from "../Context";

const Notifications = () => {
    const { answerCall, call, callAccepted } = useContext(SocketContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        console.log('check co call k? ', call)
        if (call.isReceivingCall && !callAccepted) {
            handleShow();
        }
    }, [call, callAccepted]);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{call} is calling</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn nhận cuộc gọi không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={answerCall}>
                        Answer Call
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Notifications;
