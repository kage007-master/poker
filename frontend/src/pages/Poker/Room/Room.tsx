import { useContext, useEffect } from "react";
import { SocketContext } from "context/socket";
import { useDispatch, useSelector } from "react-redux";
import { setRobbyInfo } from "store/poker.slice";
import { AppDispatch, RootState } from "store";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SvgTable } from "../../../assets/svg/Table.svg";
import { ReactComponent as SvgUser } from "../../../assets/svg/User.svg";
import { setSignUp, setWalletConnect } from "store/modal.slice";
import { numberToSTR } from "utils/poker";
import { getUsers } from "store/auth.slice";

const Component = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pokersocket } = useContext(SocketContext);

  const rooms = useSelector((state: RootState) => state.poker.robbyInfo);
  const auth = useSelector((state: RootState) => state.auth);
  const { address } = useSelector((state: RootState) => state.auth.user);

  const onJoin = (roomId: number) => {
    if (address) pokersocket.emit("enterRoom", { roomId, address });
    else alert("You should login!!!");
  };

  useEffect(() => {
    dispatch(getUsers());
    pokersocket.on("lobbyInfo", (data: any) => {
      dispatch(setRobbyInfo(data));
    });
    pokersocket.on("avaliableTableId", (tableId: number) => {
      navigate(`/game/${tableId}`);
    });
    pokersocket.emit("joinGame");
    return () => {
      pokersocket.off("lobbyInfo");
      pokersocket.off("avaliableTableId");
    };
  }, []);

  return (
    <>
      <img
        className="absolute select-none drop-shadow-[60px_50px_60px_rgba(0,0,0,.4)]"
        src="/assets/table/room.png"
        alt="table"
        draggable={false}
      />
      {address ? (
        <div className="absolute top-[6.5%] lg:top-[7.5%] right-[35.5%] z-30 flex items-center">
          <div className="flex items-center border p-1 lg:p-1.5 border-[#31395F88] myround">
            <img
              className="w-[16px] lg:w-[24px]"
              src="/assets/switcher_bg.png"
            />
            <p className="text-[10px] lg:text-[16px] ml-2 text-white">
              {auth.user.balance["ebone"]}
              <span className="gradient-text">{" EBONE"}</span>
            </p>
          </div>
          <img
            className="ml-2 w-[32px] lg:w-[48px] border border-[#31395F88] rounded-full"
            src={auth.user.avatar}
          />
        </div>
      ) : (
        <>
          <button
            className="absolute top-[8%] left-[50.5%] z-30 w-[7%]"
            onClick={() => dispatch(setWalletConnect(true))}
          >
            <img src="/assets/buttons/lobby/login.png" />
          </button>
          <button
            className="absolute top-[8%] left-[58%] z-30 w-[7%]"
            onClick={() => dispatch(setSignUp(true))}
          >
            <img src="/assets/buttons/lobby/signup.png" />
          </button>
        </>
      )}

      <div className="absolute top-[20%] z-20 left-[2.5%] w-[62%] h-[76%] max-h-[80%]">
        <div className="roomtable opacity-60 flex items-center uppercase text-[10px] lg:text-[16px] h-[12%]">
          <p className="gradient-text">Blinds</p>
          <p className="gradient-text">Buy - In</p>
          <p className="gradient-text">Type</p>
          <p className="gradient-text">Tables</p>
          <p className="gradient-text">Players</p>
          <p className="gradient-text text-right">Action</p>
        </div>
        <div className="h-[88%] max-h-[88%] overflow-auto">
          {rooms.map((table: any, id) => (
            <div key={id} className="h-[17%]">
              <div className="roomtable flex items-center text-[12px] h-full-2 lg:text-[18px] border-b-2 border-[#495577]">
                <div className="flex items-center gradient-text">
                  <img
                    src="/assets/pic.png"
                    className="h-[12px] lg:h-[18px] px-[2%]"
                  />
                  {numberToSTR(table.smallBlind) + "/"}
                  <img
                    src="/assets/pic.png"
                    className="h-[12px] lg:h-[18px] px-[2%]"
                  />
                  {numberToSTR(table.bigBlind)}
                </div>
                <div className="flex items-center gradient-text">
                  <img
                    src="/assets/pic.png"
                    className="h-[12px] lg:h-[18px] px-[2%]"
                  />
                  {numberToSTR(table.BuyIn)}
                  {table.type === "Ring Game" && (
                    <>
                      /
                      <img
                        src="/assets/pic.png"
                        className="h-[12px] lg:h-[18px] px-[2%]"
                      />
                      {numberToSTR(table.maxBuyIn)}
                    </>
                  )}
                </div>
                <div
                  className={`gradient-text${
                    table.type === "Ring Game" ? 1 : 2
                  }`}
                >
                  {table.type}
                </div>
                <div className="flex items-center gradient-text">
                  <SvgTable className="w-6 h-6 lg:w-8 lg:h-8"></SvgTable>
                  {table.tableCnts}
                </div>
                <div className="flex items-center gradient-text">
                  <SvgUser className="w-6 h-6 lg:w-8 lg:h-8"></SvgUser>
                  {table.playerCnt}
                </div>
                {table.type === "Turbo SNG" && table.status === "FINISHED" ? (
                  <div className="gradient-text">{table.status}</div>
                ) : (
                  <button
                    className="uppercase"
                    onClick={() => onJoin(table.id)}
                  >
                    <img src="/assets/buttons/join.png" alt=""></img>
                  </button>
                )}
              </div>
              <div className="border-y-[1px] border-[#6980A3] w-full"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-[4%] w-[30%] right-[1.8%] h-[10%] flex">
        <div className="w-[50%] flex items-center justify-center">
          <img className="w-[20%]" src="/assets/users.png"></img>
        </div>
        <div className="w-[50%] flex items-center justify-center">
          <img className="w-[20%]" src="/assets/table.png"></img>
        </div>
      </div>
      <div
        className="absolute top-[14%] w-[30%] right-[1.8%] h-[1.5%] bg-center bg-cover bg-no-repeat flex"
        style={{ backgroundImage: `url(/assets/bar.png)` }}
      >
        <img src="/assets/bar-left.png" className="w-[50%] h-[90%]"></img>
        <img
          src="/assets/bar-right.png"
          className="hidden w-[50%] h-[90%]"
        ></img>
      </div>
      <div className="absolute top-[16%] w-[30%] right-[1.8%] h-[78%] text-[10px] lg:text-[16px]">
        <div className="usertable opacity-60 flex items-center uppercase h-[10%]">
          <p className="gradient-text">Player</p>
          <p className="gradient-text text-center">Avatar</p>
          <p className="gradient-text text-center">#</p>
          <p className="gradient-text text-right">EBone</p>
        </div>
        <div className="h-[90%] max-h-[90%] overflow-auto gradient-text">
          {auth.users.map((user: any, index) => (
            <div key={index} className="h-[15%]">
              <div className="usertable items-center h-full-2 border-b-[#383F63] border-b-[2px]">
                <p>{user.name}</p>
                <div className="flex justify-center w-full">
                  <img
                    src={user.avatar}
                    className="border border-[#D4E9FF] rounded-full w-6 h-6 lg:w-8 lg:h-8"
                  ></img>
                </div>
                <p className="text-center">{index + 1}</p>
                <p className="text-right">{user.balance["ebone"]}</p>
              </div>
              <div className="border-y-[1px] border-[#4D5A7D] w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Component;
