import { useContext, useEffect } from "react";
import { SocketContext } from "context/socket";
import { useDispatch, useSelector } from "react-redux";
import { setTableInfo } from "store/poker.slice";
import { RootState } from "store";
import { useNavigate, useParams } from "react-router-dom";
import TopLeftControllers from "./TopLeftControllers";
import Chat from "./Chat";
import Leave from "./Leave";
import AddChip from "./AddChip";
import BottomRightControllers from "./BottomRightControllers";
import "react-circular-progressbar/dist/styles.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import GradientSVG from "./GradientSVG";
import Players from "./Players";
import { numbersToCards, timeToStr } from "utils/poker";
import { ToastrContext } from "providers/ToastrProvider";
import { setPrize, setPrizeData } from "store/modal.slice";
import { setBalance } from "store/auth.slice";

const positionClasses = [
  " left-[47%] top-[88.4%]",
  " left-[0.6%] top-[51%]",
  " left-[10.4%] top-[7.5%]",
  " left-[47%] top-[0.5%]",
  " right-[10.4%] top-[7.5%]",
  " right-[0.6%] top-[51%]",
];

const Component = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pokersocket } = useContext(SocketContext);
  const { address } = useSelector((state: RootState) => state.auth.user);
  const { tableInfo } = useSelector((state: RootState) => state.poker);
  const notify = useContext(ToastrContext);

  useEffect(() => {
    if (!address) navigate("");
    pokersocket.on("tableInfo", (data: any) => {
      dispatch(setTableInfo({ data, address }));
    });
    pokersocket.on("finished", (data: any) => {
      dispatch(setBalance({ chain: "ebone", amount: data.prize }));
      dispatch(setPrizeData(data));
      dispatch(setPrize(true));
    });
    pokersocket.on("error", (msg: string) => {
      notify.error(msg);
      navigate("/");
    });
    if (address) pokersocket.emit("enterTable", { id, address });
    return () => {
      pokersocket.off("tableInfo");
      pokersocket.off("error");
      pokersocket.off("finished");
    };
  }, [address]);
  if (!tableInfo.type) return null;
  return (
    <>
      <img
        className="absolute w-full select-none drop-shadow-[60px_50px_60px_rgba(0,0,0,.4)]"
        src="/assets/table/table.svg"
        alt="table"
        draggable={false}
      />
      {tableInfo.remainTime > 0 && (
        <div className="absolute z-30 gradient-text">
          {"Start after " + tableInfo.remainTime + "s"}
        </div>
      )}
      {tableInfo.playingTime > 0 && (
        <div className="absolute z-30 gradient-text top-[4%] right-[8%]">
          {`Next Level: ${tableInfo.smallBlind * 2}/${
            tableInfo.bigBlind * 2
          }(${timeToStr(tableInfo.playingTime)})`}
        </div>
      )}
      <TopLeftControllers />
      <Chat />
      <Leave />
      <AddChip />
      <BottomRightControllers />

      <div className="w-[67%] h-[85%] absolute">
        {tableInfo.status === "IDLE" || tableInfo.status === "STRADDLE" ? (
          <div
            className={
              "absolute z-40 w-[6%]" +
              positionClasses[tableInfo.currentPlayerId]
            }
          >
            <GradientSVG />
            <CircularProgressbar
              strokeWidth={10}
              value={(tableInfo.countdown * 100) / 12}
              styles={buildStyles({
                backgroundColor: "transparent",
                pathColor: `url(#gradient${
                  tableInfo.countdown > 6 ? "1" : "0"
                })`,
                trailColor: "transparent",
              })}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="relative flex justify-center items-center w-full h-full">
          <Players />
          {/* Main cards playground */}
          {tableInfo.communityCards && (
            <div className="z-50 grid gap-1 grid-cols-5 place-items-center absolute w-[46%] left-[27%]">
              {tableInfo.communityCards.map(
                (community: number[], index: number) => (
                  <div className="flex flex-col" key={index}>
                    {numbersToCards(community).map((card: string) => (
                      <img
                        key={card}
                        src={`/assets/cards/${
                          community.length == 1 ? "large" : "small"
                        }/${card}.png`}
                        alt=""
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {tableInfo.pot > 0 ? (
            <div className="flex justify-center absolute z-30 w-[55%] top-[30%]">
              <p className="text-center font-[600] text-[#6C7BA7] text-shadow2">
                TOTAL POT:{" "}
                <span className="text-[#1BD1E1]">{tableInfo.pot}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Component;
