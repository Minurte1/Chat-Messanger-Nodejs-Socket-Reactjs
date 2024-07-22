import { useContext } from "react"
import { Box, Button, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react"
import { SocketContext } from "../Context"

const Notifications = () => {
    const { answerCall, call, callAccepted } = useContext(SocketContext);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Open modal when receiving a call
    if (call.isReceivingCall && !callAccepted) {
        onOpen();
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{call.name} is calling</ModalHeader>
                    <ModalBody>
                        Bạn có muốn nhận cuộc gọi không?
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={answerCall} border="1px" borderStyle="solid" borderColor="black">
                            Answer Call
                        </Button>
                        <Button variant="ghost" ml={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Notifications;
