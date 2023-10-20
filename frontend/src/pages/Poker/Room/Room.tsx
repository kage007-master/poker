import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "context/socket";
import { useDispatch, useSelector } from "react-redux";
import { setRobbyInfo } from "store/poker.slice";
import { AppDispatch, RootState } from "store";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SvgTable } from "../../../assets/svg/Table.svg";
import { ReactComponent as SvgUser } from "../../../assets/svg/User.svg";
import { setProfile, setWalletConnect } from "store/modal.slice";
import { numberToSTR } from "utils/poker";
import { getUsers, setLogout } from "store/auth.slice";
import { ToastrContext } from "providers/ToastrProvider";
import { logout } from "@multiversx/sdk-dapp/utils";
import { images } from "config/const";

const Component = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pokersocket } = useContext(SocketContext);
  const notify = useContext(ToastrContext);

  const rooms = useSelector((state: RootState) => state.poker.robbyInfo);
  const auth = useSelector((state: RootState) => state.auth);
  const { address } = useSelector((state: RootState) => state.auth.user);
  const [menu, setMenu] = useState(false);
  const dropmenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (menu) document.addEventListener("click", handleClickOutside);
      else document.removeEventListener("click", handleClickOutside);
    }, 100);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menu]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropmenuRef.current &&
      !dropmenuRef.current.contains(event.target as Node)
    ) {
      setMenu(false);
    }
  };

  const onJoin = (roomId: number) => {
    if (address) pokersocket.emit("enterRoom", { roomId, address });
    else notify.error("You should login first!!!");
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
        src="/assets/table/room.svg"
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
            <p className="ml-2 text-white">
              {auth.user.balance["ebone"]}
              <span className="gradient-text">{" EBONE"}</span>
            </p>
          </div>
          <img
            className="ml-2 w-[32px] lg:w-[48px] border border-[#31395F88] rounded-full cursor-pointer"
            src={auth.user.avatar}
            onClick={() => setMenu(!menu)}
          />
          {menu && (
            <div
              ref={dropmenuRef}
              className="absolute right-0 top-[110%] bg-[#57688B] rounded-md px-3 min-w-[120px] lg:min-w-[180px]"
            >
              <p className="py-2 lg:py-3 border-b-[1px] text-center gradient-text">
                {auth.user.name}
              </p>
              <div className="flex items-center py-2 lg:py-3 cursor-pointer">
                <SvgUser className="w-4 h-4 lg:w-6 lg:h-6" />
                <p className="gradient-text text-tiny">Deposit</p>
              </div>
              <div className="flex items-center py-2 lg:py-3 cursor-pointer">
                <SvgUser className="w-4 h-4 lg:w-6 lg:h-6" />
                <p className="gradient-text text-tiny">Withdraw</p>
              </div>
              <div
                className="flex items-center py-2 lg:py-3 cursor-pointer"
                onClick={() => {
                  dispatch(setProfile(true));
                }}
              >
                <SvgUser className="w-4 h-4 lg:w-6 lg:h-6" />
                <p className="gradient-text text-tiny">My Profile</p>
              </div>
              <div
                className="flex items-center py-2 lg:py-3 cursor-pointer border-t-[1px]"
                onClick={() => {
                  logout();
                  setMenu(false);
                  dispatch(setLogout());
                }}
              >
                <SvgUser className="w-4 h-4 lg:w-6 lg:h-6" />
                <p className="gradient-text text-tiny">Disconnect</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className="absolute top-[8%] left-[46.5%] z-30 w-[18%] btn1 h-[8%]"
          onClick={() => dispatch(setWalletConnect(true))}
        >
          <p className="gradient-text">Connect Wallet</p>
        </button>
      )}

      <div className="absolute top-[20%] z-20 left-[2.5%] w-[62%] h-[76%] max-h-[80%]">
        <div className="roomtable opacity-60 flex items-center uppercase h-[12%]">
          <p className="gradient-text">Blinds</p>
          <p className="gradient-text">Buy - In</p>
          <p className="gradient-text">Type</p>
          <p className="gradient-text">Tables</p>
          <p className="gradient-text">Players</p>
          <p className="gradient-text text-right">Action</p>
        </div>
        <div className="h-[88%] max-h-[88%] overflow-auto">
          {rooms.map((table: any, id) => (
            <>
              {table.status !== "FINISHED" && (
                <div key={id} className="h-[17%]">
                  <div className="roomtable flex items-center h-full-2 border-b-2 border-[#495577]">
                    <div className="flex items-center gradient-text">
                      <img src={images.pic} className="pic px-[2%]" />
                      {numberToSTR(table.smallBlind) + "/"}
                      <img src={images.pic} className="pic px-[2%]" />
                      {numberToSTR(table.bigBlind)}
                    </div>
                    <div className="flex items-center gradient-text">
                      <img src={images.pic} className="pic px-[2%]" />
                      {numberToSTR(table.BuyIn)}
                      {table.type === "Ring Game" && (
                        <>
                          /
                          <img src={images.pic} className="pic px-[2%]" />
                          {numberToSTR(table.maxBuyIn)}
                        </>
                      )}
                    </div>
                    <div
                      className={`gradient-text-${
                        table.type === "Ring Game" ? "h" : "d"
                      }`}
                    >
                      {table.type}
                    </div>
                    <div className="flex items-center gradient-text">
                      <SvgTable className="w-6 h-6 lg:w-8 lg:h-8" />
                      {table.tableCnts}
                    </div>
                    <div className="flex items-center gradient-text">
                      <SvgUser className="w-6 h-6 lg:w-8 lg:h-8" />
                      {table.playerCnt}
                    </div>
                    {table.type === "Turbo SNG" &&
                    table.status === "FINISHED" ? (
                      <div className="gradient-text">{table.status}</div>
                    ) : (
                      <button
                        className="btn2 uppercase p-2"
                        onClick={() => onJoin(table.id)}
                      >
                        <div className="btn-blue rounded-md p-1">
                          <p className="gradient-text text-tiny">Join</p>
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="border-y-[1px] border-[#6980A3] w-f-4"></div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
      <div className="absolute top-[4%] w-[30%] right-[1.8%] h-[10%] flex">
        <div className="w-[50%] flex items-center justify-center">
          <img className="w-[20%]" src="/assets/users.png" />
        </div>
        <div className="w-[50%] flex items-center justify-center">
          <img className="w-[20%]" src="/assets/table.png" />
        </div>
      </div>
      <div
        className="absolute top-[14%] w-[30%] right-[1.8%] h-[1.5%] bg-center bg-cover bg-no-repeat flex"
        style={{ backgroundImage: `url(/assets/bar.png)` }}
      >
        <img src="/assets/bar-left.png" className="w-[50%] h-[90%]" />
        <img src="/assets/bar-right.png" className="hidden w-[50%] h-[90%]" />
      </div>
      <div className="absolute top-[16%] z-20 w-[30%] right-[1.8%] h-[78%] max-h-[78%]">
        <div className="usertable opacity-60 flex items-center uppercase h-[10%]">
          <p className="gradient-text">Player</p>
          <p className="gradient-text text-center">Avatar</p>
          <p className="gradient-text text-center">#</p>
          <p className="gradient-text text-right">EBone</p>
        </div>
        <div className="h-[90%] max-h-[90%] overflow-auto">
          {auth.users.map((user: any, index) => (
            <div key={index} className="h-[15%]">
              <div className="usertable w-f-4 flex items-center h-full-2 border-b-[#383F63] border-b-[2px]">
                <div className="flex items-center gradient-text">
                  {user.name}
                </div>
                <div className="flex items-center justify-center w-full">
                  <img
                    src={user.avatar}
                    className="border border-[#D4E9FF] rounded-full w-6 h-6 lg:w-8 lg:h-8"
                  />
                </div>
                <div className="flex items-center justify-center gradient-text">
                  {index + 1}
                </div>
                <div className="flex items-center justify-end gradient-text">
                  {user.balance["ebone"]}
                </div>
              </div>
              <div className="border-y-[1px] border-[#4D5A7D] w-f-4"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Component;
