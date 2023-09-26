import { useEffect, useContext, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setAddChip } from "store/modal.slice";
import { ToastrContext } from "providers/ToastrProvider";

import { RootState } from "store";
import { SocketContext } from "context/socket";

const positions = [
  "top-[55%]",
  "left-[8.5%] top-[60%]",
  "left-[15%] top-[25%]",
  "top-[20%]",
  "left-[64.5%] top-[25%]",
  "left-[71%] top-[60%]",
  "left-[7%] top-[63%]",
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
              "backdrop-blur-xl p-2 absolute w-[20%] z-20 rounded-3xl " +
              positions[addchip]
            }
          >
            <div className="flex items-center justify-center gradient-text">
              {value} <img src="/assets/pic.png" className="pic px-[2%]" />
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
            <div className="grid grid-cols-2 gap-1">
              <img
                src={"/assets/ok.png"}
                className="cursor-pointer"
                onClick={() => {
                  if (addchip < 6)
                    pokersocket.emit("takeSeat", {
                      tableId: tableInfo.id,
                      address,
                      position: addchip,
                      buyIn: value,
                    });
                  dispatch(setAddChip(-1));
                }}
              />
              <img
                src={"/assets/cancel.png"}
                className="cursor-pointer"
                onClick={() => dispatch(setAddChip(-1))}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalAddChip;
