import { useState, useContext } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";

import { SocketContext } from "../Context";

const Options = () => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    const [show, setShow] = useState(false);

    const handleCopyID = () => {
        if (me) console.log('check me =>', me);
        navigator.clipboard.writeText(me);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="container mt-5">
            <div className="border p-3">
                <Form>
                    <div className="mb-3">
                        <h6>Account Info</h6>
                        <Form.Label>Username</Form.Label>
                        <FormControl type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <Button variant="primary" onClick={handleCopyID} className="mt-3" >
                            Copy ID
                        </Button>
                    </div>
                    <div className="mb-3">
                        <h6>Make a Call</h6>
                        <Form.Label>User id to call</Form.Label>
                        <FormControl type="text" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
                        {callAccepted && !callEnded ? (
                            <Button variant="danger" onClick={leaveCall} className="mt-3" >
                                Hang up
                            </Button>
                        ) : (
                            <Button variant="success" onClick={handleShow} className="mt-3" >
                                Call
                            </Button>
                        )}
                    </div>
                </Form>
            </div >

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Make a Call</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>User id to call: {idToCall}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { callUser(idToCall); handleClose(); }}>
                        Call
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
};

export default Options;
