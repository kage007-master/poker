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
  const { rank, prize } = useSelector(
    (state: RootState) => state.modal.prizedata
  );
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
          <p className="uppercase">
            {rank === 1 ? "Congratulations!" : "Good Game!"}
          </p>
          <p className="text-huge gradient-text">
            You finished {rank}
            {rank === 1 ? "st" : rank === 2 ? "nd" : "th"}
          </p>
          <div className="bg-[#505880] p-2 lg:p-3 rounded-md">
            <p className="gradient-text">Prize: {prize} EBONE</p>
          </div>
          <img src="/assets/prize.png" className="mx-auto w-32 lg:w-40" />
        </div>
        <div className="flex justify-center items-center bg-gradient-to-br from-[#505880] to-[#667AA0] min-h-[70px]">
          <button className="btn2 uppercase p-2" onClick={handleClose}>
            <div className="btn-blue rounded-md py-1 px-8">
              <p className="gradient-text">Ok</p>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPrize;
