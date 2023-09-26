import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setPrize } from "store/modal.slice";
import { AppDispatch, RootState } from "store";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("body");

const ModalPrize = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.modal.prize);
  const handleClose = async () => {
    dispatch(setPrize(false));
    navigate("/");
  };
  return (
    <Modal
      id="modalAuth"
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="modal-fade modal-content text-sm md:text-base flex justify-center"
      overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      contentLabel="Prize Panel"
    >
      <div className="w-[300px] lg:w-[420px] rounded-2xl mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 lg:gap-5 items-center backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.5] to-[#5A6B8C]/[.5] w-full h-max p-3 lg:p-4">
          <p className="uppercase">Good Game!</p>
          <p className="text-xl lg:text-3xl gradient-text">You finished 1st</p>
          <div className="bg-[#505880] p-2 lg:p-3 rounded-md">
            <p className="gradient-text">Prize: 1000 EBONE</p>
          </div>
          <img src="/assets/prize.png" className="mx-auto w-32 lg:w-40"></img>
        </div>
        <div className="flex flex-col items-center bg-gradient-to-br from-[#505880] to-[#667AA0] h-full py-2 lg:py-4">
          <button onClick={handleClose}>
            <img className="w-[80%] mx-auto" src="/assets/buttons/save  .png" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPrize;
