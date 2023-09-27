import { images } from "config/const";
import { SocketContext } from "context/socket";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "store";
import { setAddChip } from "store/modal.slice";
import { numbersToCards } from "utils/poker";

const positionClasses = [
  " left-[47%] top-[88.4%]",
  " left-[0.6%] top-[51%]",
  " left-[10.4%] top-[7.5%]",
  " left-[47%] top-[0.5%]",
  " right-[10.4%] top-[7.5%]",
  " right-[0.6%] top-[51%]",
];

const bubblesPositionClasses = [
  " hidden",
  " left-[6.5%] z-20 top-[55%] rotate-[90deg] w-[3%] h-[2.1%]",
  " left-[10%] z-20 top-[20%] rotate-[140deg] w-[3%] h-[2.1%]",
  " left-[48.5%] z-20 top-[12%] w-[3%] h-[2.1%]",
  " right-[10%] z-20 top-[20%] rotate-[40deg] w-[3%] h-[2.1%]",
  " right-[6.5%] z-20 top-[55%] rotate-[90deg] w-[3%] h-[2.1%]",
];

const betPositionClasses = [
  " left-[58%] bottom-[15%]",
  " left-[12%] top-[53%]",
  " left-[14%] top-[22%]",
  " right-[53%] top-[12%]",
  " right-[14%] top-[22%]",
  " right-[12%] top-[53%]",
];

const cardPositionClasses = [
  [
    " left-[43%] top-[68%] w-[7%]",
    " left-[12%] top-[60%] w-[5%]",
    " left-[14%] top-[29%] w-[5%]",
    " left-[54%] top-[12%] w-[5%]",
    " left-[76%] top-[29%] w-[5%]",
    " left-[78%] top-[60%] w-[5%]",
  ],
  [
    " left-[50%] top-[68%] w-[7%]",
    " left-[17%] top-[60%] w-[5%]",
    " left-[19%] top-[29%] w-[5%]",
    " left-[59%] top-[12%] w-[5%]",
    " left-[81%] top-[29%] w-[5%]",
    " left-[83%] top-[60%] w-[5%]",
  ],
];

const buttonPositionClasses = [
  " left-[38%] top-[77%]",
  " left-[7%] top-[64%]",
  " left-[9%] top-[33%]",
  " left-[65%] top-[15.5%]",
  " left-[86%] top-[33%]",
  " left-[88.7%] top-[64%]",
];

const betSide = ["right", "right", "right", "left", "left", "left"];

const Players = () => {
  const { id } = useParams();
  const { pokersocket } = useContext(SocketContext);
  const { address } = useSelector((state: RootState) => state.auth.user);
  const { tableInfo } = useSelector((state: RootState) => state.poker);
  const { prevDealerId } = useSelector((state: RootState) => state.poker);
  const dispatch = useDispatch();

  const onTakeSeat = (position: number) => {
    if (!tableInfo.isMember && !tableInfo.players[position].address) {
      if (tableInfo.type === "Turbo SNG")
        pokersocket.emit("takeSeat", {
          tableId: id,
          address,
          position,
          buyIn: tableInfo.BuyIn,
        });
      else dispatch(setAddChip(position));
    }
  };
  return (
    <>
      {tableInfo.players &&
        tableInfo.players.map((player: any, index: number) => {
          return (
            <div key={index}>
              <div
                className={
                  "absolute flex gap-[20%]" + bubblesPositionClasses[index]
                }
              >
                <span
                  className={`w-[40%] h-full rounded-full ${
                    player.disconnect ? "bg-[#1e2940]/[.5]" : "green-bubble"
                  }`}
                ></span>
                <span
                  className={`w-[40%] h-full rounded-full ${
                    player.disconnect ? "bg-[#1e2940]/[.5]" : "green-bubble"
                  }`}
                ></span>
              </div>

              {/* Bet */}
              {player.betAmount > 0 && (
                <>
                  <div
                    className={
                      "flex z-40 absolute w-[3%]" + betPositionClasses[index]
                    }
                  >
                    <img
                      className="w-[100%] absolute left-[7%] top-[7%]"
                      src="/assets/chips/blue_chip.png"
                      alt=""
                    />
                    <img
                      className="w-[100%]"
                      src="/assets/chips/pink_chip.png"
                      alt=""
                    />
                  </div>
                  <div
                    className={
                      `absolute flex z-30 h-[5.5%] gap-1 items-center bg-[#5A6B8C]/[.5] ${
                        betSide[index] === "left"
                          ? "pr-[3.6%] pl-[1.5%]"
                          : "pl-[4%] pr-[1.5%]"
                      } py-1 rounded-full` + betPositionClasses[index]
                    }
                  >
                    <p className="font-[700] text-[#D4E9FF]">
                      {player.betAmount}
                    </p>
                    <img className="pic" src={images.pic} alt="" />
                  </div>
                </>
              )}
              {tableInfo.status === "OVER" && player.prize > 0 && (
                <>
                  <div
                    className={
                      "flex z-40 absolute w-[3%]" + betPositionClasses[index]
                    }
                  >
                    <img
                      className={"w-[100%] absolute left-[7%] top-[7%]"}
                      src="/assets/chips/blue_chip.png"
                      alt=""
                    />
                    <img
                      className={"w-[100%]"}
                      src="/assets/chips/pink_chip.png"
                      alt=""
                    />
                  </div>
                  <div
                    className={
                      `absolute flex z-30 h-[5.5%] gap-1 items-center bg-[#5A6B8C]/[.5] ${
                        betSide[index] === "left"
                          ? "pr-[3.6%] pl-[1.5%]"
                          : "pl-[4%] pr-[1.5%]"
                      } py-1 rounded-full` + betPositionClasses[index]
                    }
                  >
                    <p className="font-[700] text-[#D4E9FF]">{player.prize}</p>
                    <img className="pic" src={images.pic} alt="" />
                  </div>
                </>
              )}

              {numbersToCards(player.cards).map((card: string, i: number) => (
                <img
                  key={card + i}
                  className={"absolute z-30" + cardPositionClasses[i][index]}
                  style={{
                    animationName: `card${i}`,
                    animationDuration: `${i == 0 ? 0.2 : 0.5}s`,
                  }}
                  src={`/assets/cards/${
                    index == 0 ? "large" : "small"
                  }/${card}.png`}
                  alt=""
                />
              ))}

              {index == tableInfo.dealerId && (
                <div
                  className={
                    "absolute z-30 w-[5%]" + buttonPositionClasses[index]
                  }
                  style={{
                    animationName: `dealer${prevDealerId}`,
                    animationDuration: "0.5s",
                  }}
                >
                  <img src="/assets/buttons/D.png" alt="" />
                </div>
              )}
              {index == tableInfo.SBId && (
                <div
                  className={
                    "absolute z-30 w-[5%]" + buttonPositionClasses[index]
                  }
                >
                  <img src="/assets/buttons/S.png" alt="" />
                </div>
              )}
              {/* Avatar */}
              <div
                className={
                  "absolute w-[6%] flex justify-center z-30" +
                  positionClasses[index]
                }
              >
                <img
                  className={
                    "avatar rounded-xl lg:rounded-2xl p-[3px] lg:p-[4px] xl:p-[5px] 2xl:p-[6px] " +
                    (!player.address && !tableInfo.isMember
                      ? "cursor-pointer"
                      : "")
                  }
                  src={
                    player.address
                      ? player.avatar
                      : tableInfo.isMember
                      ? "/assets/add_dis.png"
                      : "/assets/add.png"
                  }
                  alt=""
                  onClick={() => onTakeSeat(index)}
                />
                {player.address && (
                  <div
                    className={
                      "absolute flex justify-center items-center text-[#D4E9FF] px-3 bg-slate-600 rounded-full" +
                      (index === 0
                        ? " -bottom-[18px] lg:-bottom-[24px] 2xl:-bottom-[32px]"
                        : " -top-[18px] lg:-top-[24px] 2xl:-top-[32px]")
                    }
                  >
                    <div>{player.stack}</div>
                    <img src={images.pic} className="pic pl-[20%]" />
                  </div>
                )}

                {(player.status == "FOLD" || player.status == "CHECK") && (
                  <div className="absolute -bottom-[1.5%] fold w-full px-[1%] py-[10%] rounded-b-xl lg:rounded-b-2xl rounded-t-xl">
                    <p className="text-[#F5FAFF] font-[700] text-center">
                      {player.status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Players;
