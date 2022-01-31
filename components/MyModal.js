import { useState, useEffect } from "react";
import Modal from "react-modal";
import AutomationModal from "./AutomationModal";
import CategoryModal from "./CategoryModal";
import SetupBudgetModal from "./SetupBudgetModal";
import XIcon from "@heroicons/react/outline/XIcon";

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
    props.setCurrModal(null);
  };

  useEffect(() => {
    setIsOpen(props.currModal != null);
  }, [props.currModal]);

  console.log("About to render modal");
  console.log(props.currModal);

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={500}
      contentLabel="Example Modal"
      className={`${props.currModal == null ? "hidden" : ""}`}
    >
      <div className="flex justify-end" onClick={closeModal}>
        <XIcon className="h-[30px] w-[30px] hover:cursor-pointer hover:text-red-500" />
      </div>

      <style jsx global>{`
        .ReactModal__Overlay {
          opacity: 0;
          transform: translateX(0px);
          transition: all 500ms ease-in-out;
        }

        .ReactModal__Overlay--after-open {
          opacity: 1;
          transform: translateX(0px);
        }

        .ReactModal__Overlay--before-close {
          opacity: 0;
          transform: translateX(0px);
        }
      `}</style>

      {props.currModal &&
        ((props.currModal == "Categories" && (
          <CategoryModal
            categories={props.categories}
            addToList={props.addToList}
          />
        )) ||
          (props.currModal == "Automation" && (
            <AutomationModal
              userList={props.userCategoryList}
              userDetails={props.userDetails}
              setUserDetails={props.setUserDetails}
              nextAutoRuns={props.nextAutoRuns}
              setNextAutoRuns={props.setNextAutoRuns}
              listItems={props.listItems}
            />
          )) ||
          (props.currModal == "Initialize" && (
            <SetupBudgetModal
              userDetails={props.userDetails}
              setUserDetails={props.setUserDetails}
              sixMonthDetails={props.sixMonthDetails}
              defaultStartAmt={props.defaultStartAmt}
            />
          )))}
    </Modal>
  );
}

export default MyModal;
