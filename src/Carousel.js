import React, { useState } from "react";
import Modal from "react-modal"
function Carousel({ items }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalIsOpen(false);
    };

    return <div>
        {/* <h3>Carousel Div</h3> */}
        <div style={{marginTop:"50px", display:"flex", gap:"15px", justifyContent:"center"}} className="carousel">
            {
                items.map((item, index) => {
                    return (
                            <img key={index} style={{ height: "150px", width: "200px", objectFit: "cover" }} onClick={() => openModal(item)} src={item.image} alt="" />
                    )
                })
            }
            {/* <img src={items} alt="" /> */}
        </div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="video Modal"
        >
            {
                selectedItem && (
                    <div>

                        <button onClick={closeModal}>Close</button>
                        <div style={{ height: "400px", width: "600px" }} className="video">
                            <img style={{ height: "100%", width: "100%" }} src={selectedItem.image} alt="" />
                        </div>
                    </div>
                )
            }
        </Modal>
    </div>;
}

export default Carousel;
