import { useContext, useEffect, useState } from "react";
import { SocketContext } from "context/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { images } from "config/const";

const BottomRightControllers = () => {
  const { id } = useParams();
  const { pokersocket } = useContext(SocketContext);
  const { tableInfo } = useSelector((state: RootState) => state.poker);
  const [value, setValue] = useState(tableInfo.minRaise);
  const onFold = () => {
    pokersocket.emit("fold", { id });
  };
  const onCheck = () => {
    if (tableInfo.isTurn && tableInfo.isCheck)
      pokersocket.emit("check", { id });
  };
  const onCall = () => {
    if (tableInfo.isTurn && !tableInfo.isCheck)
      pokersocket.emit("call", { id });
  };
  const onRaise = () => {
    pokersocket.emit("raise", { id, amount: value });
  };
  const onAllIn = () => {
    pokersocket.emit("allIn", { id });
  };

  useEffect(() => {
    setValue(tableInfo.minRaise);
  }, [tableInfo.minRaise]);

  if (!tableInfo.isTurn || tableInfo.status === "STRADDLE") return null;

  return (
    <>
      <div className="grid grid-cols-4 justify-end gap-2 absolute bottom-[3%] right-[1.8%] z-50 w-[30%] h-[9%]">
        <button
          className="btn4 p-2 rounded-2xl rounded-tl-5xl"
          onClick={onFold}
        >
          <div className="h-full btn-red rounded-xl rounded-tl-4xl flex items-center justify-center">
            <img className="pic-huge" src={images.fold} />
          </div>
        </button>
        <button
          className={`btn4 rounded-2xl ${!tableInfo.isCheck ? "disabled" : ""}`}
          disabled={!tableInfo.isCheck}
          onClick={onCheck}
        >
          <p className="gradient-text text-tiny font-[700]">CHECK</p>
        </button>
        <button
          className={`btn4 rounded-2xl ${tableInfo.isCheck ? "disabled" : ""}`}
          disabled={tableInfo.isCheck}
          onClick={onCall}
        >
          <p className="gradient-text text-tiny font-[700]">CALL</p>
        </button>
        <button
          className="btn4 p-2 rounded-2xl rounded-br-5xl"
          onClick={onRaise}
        >
          <div className="h-full btn-blue rounded-xl rounded-br-4xl flex items-center justify-center">
            <img className="pic-huge" src={images.raise} />
          </div>
        </button>
      </div>

      {/* MIN, 1/2, POT, MAX */}
      <div className="grid grid-cols-4 justify-end gap-2 absolute bottom-[15%] right-[1.8%] z-50 w-[18.5%] h-[8.4%]">
        <button className="btn4 rounded-2xl rounded-tl-4xl" onClick={() => {}}>
          <p className="gradient-text text-tiny font-[700]">MIN</p>
        </button>
        <button className="btn4 rounded-2xl" onClick={() => {}}>
          <p className="gradient-text text-tiny font-[700]">1/2</p>
        </button>
        <button className="btn4 rounded-2xl" onClick={() => {}}>
          <p className="gradient-text text-tiny font-[700]">POT</p>
        </button>
        <button className="btn4 rounded-2xl rounded-br-4xl" onClick={() => {}}>
          <p className="gradient-text text-tiny font-[700]">MAX</p>
        </button>
      </div>

      {/* Slider */}
      <div className="grid grid-cols-1 justify-end absolute bottom-[30%] right-[1.8%] z-50 w-[14%]">
        <input
          className={"custom-range"}
          type="range"
          min={tableInfo.minRaise}
          max={tableInfo.players[0].stack + tableInfo.players[0].betAmount}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
      <div className="grid grid-cols-1 justify-end absolute bottom-[36%] right-[1.8%] z-50 w-[14%]">
        <div className="relative flex justify-center items-center">
          <img
            className="drop-shadow-[0px_3px_1px_rgba(0,0,0,.4)]"
            src="/assets/buttons/range/rectangle.svg"
            alt=""
            draggable={false}
          />
          <div className="absolute flex gap-1 items-center">
            <p className="text-[#7C95BF] text-shadow text-huge">{value}</p>
            <img
              className="pic-huge"
              src={images.pic}
              alt=""
              draggable={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomRightControllers;
