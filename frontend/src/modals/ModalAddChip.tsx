import { useEffect, useContext, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setAddChip } from "store/modal.slice";
import { ToastrContext } from "providers/ToastrProvider";

import { RootState } from "store";
import { SocketContext } from "context/socket";
import { images } from "config/const";

const positions = [
  "top-[49%]",
  "left-[5.5%] top-[60%]",
  "left-[12%] top-[25%]",
  "top-[20%]",
  "left-[61.5%] top-[25%]",
  "left-[68%] top-[60%]",
  "left-[4%] top-[57%]",
];

Modal.setAppElement("body");
const ModalAddChip = () => {
  const { pokersocket } = useContext(SocketContext);
  const { address } = useSelector((state: RootState) => state.auth.user);
  const { tableInfo } = useSelector((state: RootState) => state.poker);
  const notify = useContext(ToastrContext);
  const dispatch = useDispatch();
  const { addchip } = useSelector((state: RootState) => state.modal);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(tableInfo.bigBlind * 10);
  }, [tableInfo.bigBlind]);

  return (
    <div>
      <Modal
        isOpen={addchip != -1}
        onRequestClose={() => dispatch(setAddChip(-1))}
        className="flex justify-center items-center w-full h-full px-[2%] 2xl:px-[9%]"
        overlayClassName="bg-transparent absolute w-screen h-screen left-0 top-0 z-50 rounded-xl"
      >
        <div className={"flex justify-center items-center relative"}>
          <img
            className="select-none z-10 drop-shadow-[60px_50px_60px_rgba(0,0,0,.4)]"
            src="/assets/table/empty.png"
            alt="table"
            draggable={false}
          />
          <div
            className={
              "modal-bg backdrop-blur-xl flex flex-col justify-between p-3 lg:p-4 absolute w-[26%] h-[32%] z-20 rounded-3xl " +
              positions[addchip]
            }
          >
            <div className="flex items-center justify-center gradient-text text-huge">
              {value} <img src={images.pic} className="pic-huge px-[2%]" />
            </div>
            <div className="py-2">
              <input
                className={"custom-range"}
                type="range"
                min={tableInfo.bigBlind * 10}
                max={tableInfo.bigBlind * 200}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="btn2 p-2"
                onClick={() => {
                  if (addchip < 6)
                    pokersocket.emit("takeSeat", {
                      tableId: tableInfo.id,
                      address,
                      position: addchip,
                      buyIn: value,
                    });
                  else {
                    pokersocket.emit("addchip", {
                      tableId: tableInfo.id,
                      address,
                      chip: value,
                    });
                  }
                  dispatch(setAddChip(-1));
                }}
              >
                <p className="gradient-text">Confirm</p>
              </button>
              <button
                className="btn2 p-2"
                onClick={() => dispatch(setAddChip(-1))}
              >
                <p className="gradient-text">Cancel</p>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalAddChip;
