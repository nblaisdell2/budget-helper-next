import { useState, useEffect } from "react";
import Modal from "react-modal";
import AutomationModal from "./AutomationModal";
import CategoryModal from "./CategoryModal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "65%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#__next");
Modal.defaultStyles.overlay.backgroundColor = "rgba(0, 0, 0, 0.7)";

function MyModal(props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  };
  const closeModal = () => {
    // setIsOpen(false);
    props.setCurrModal(null);
  };

  useEffect(() => {
    setIsOpen(props.currModal != null);
  }, [props.currModal]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {props.currModal &&
        ((props.currModal == "Categories" && (
          <CategoryModal
            categories={props.categories}
            addToList={props.addToList}
            closeModal={closeModal}
          />
        )) ||
          (props.currModal == "Automation" && (
            <AutomationModal
              userList={props.userCategoryList}
              closeModal={closeModal}
              userDetails={props.userDetails}
              // userID={props.userID}
              // budgetID={props.budgetID}
              setUserDetails={props.setUserDetails}
              nextAutoRuns={props.nextAutoRuns}
              setNextAutoRuns={props.setNextAutoRuns}
              listItems={props.listItems}
            />
          )))}
    </Modal>
  );
}

export default MyModal;
