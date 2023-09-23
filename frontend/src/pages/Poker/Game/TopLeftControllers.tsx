import { ToastrContext } from "providers/ToastrProvider";
import { useContext, useEffect, useRef, useState } from "react";

const Settings = () => {
  const [switcher, setSwitcher] = useState(true);
  return (
    <div className="absolute w-[350%] min-w-[150px] rounded-xl top-[53%] left-0 overflow-hidden">
      <div className="backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.5] to-[#5A6B8C]/[.5] w-full p-3 lg:p-4">
        <p className="text-[14px] lg:text-[18px] xl:text-[24px] gradient-text">
          Settings
        </p>
        <div className="flex text-[#6C7BA7] text-shadow2 text-[10px] lg:text-[14px] xl:text-[16px] place-items-center gap-2 my-2 xl:my-3">
          <p>EBONE</p>
          <div
            className={`flex w-[32px] lg:w-[48px] xl:w-[72px] bg-[#1e2940]/[.3] rounded-full cursor-pointer ${
              switcher ? "justify-start" : "justify-end"
            }`}
            onClick={() => setSwitcher(!switcher)}
          >
            <img
              src="/assets/switcher_bg.png"
              className="w-[16px] lg:w-[24px] xl:w-[36px]"
              alt=""
            />
          </div>
          <p>BB</p>
        </div>
        <p className="text-[10px] lg:text-[12px] text-white">Volume</p>
        <div className="my-2 xl:my-3">
          <input
            className="custom-range"
            type="range"
            min={0}
            max={100}
            step={1}
            defaultValue={50}
          />
        </div>
        <p className="text-[10px] lg:text-[12px] text-white">Sound Effects</p>
        <div className="flex text-[#6C7BA7] text-shadow2 text-[10px] lg:text-[14px] xl:text-[16px] place-items-center gap-2 my-2 xl:my-3">
          <p className={switcher ? "text-white" : ""}>ON</p>
          <div
            className={`flex w-[32px] lg:w-[48px] xl:w-[72px] bg-[#1e2940]/[.3] rounded-full cursor-pointer ${
              switcher ? "justify-start" : "justify-end"
            }`}
            onClick={() => setSwitcher(!switcher)}
          >
            <img
              src={
                switcher ? "/assets/buttons/on.png" : "/assets/buttons/off.png"
              }
              className="w-[16px] lg:w-[24px] xl:w-[36px]"
              alt=""
            />
          </div>
          <p className={!switcher ? "text-white" : ""}>OFF</p>
        </div>
        <p className="text-[10px] lg:text-[12px] text-white">Chatbox</p>
        <div className="flex text-[#6C7BA7] text-shadow2 text-[10px] lg:text-[14px] xl:text-[16px] place-items-center gap-2 mt-2 xl:mt -3">
          <p className={switcher ? "text-white" : ""}>ON</p>
          <div
            className={`flex w-[32px] lg:w-[48px] xl:w-[72px] bg-[#1e2940]/[.3] rounded-full cursor-pointer ${
              switcher ? "justify-start" : "justify-end"
            }`}
            onClick={() => setSwitcher(!switcher)}
          >
            <img
              src={
                switcher ? "/assets/buttons/on.png" : "/assets/buttons/off.png"
              }
              className="w-[16px] lg:w-[24px] xl:w-[36px]"
              alt=""
            />
          </div>
          <p className={!switcher ? "text-white" : ""}>OFF</p>
        </div>
      </div>
    </div>
  );
};

const HighHandModal = () => {
  return (
    <div className="absolute w-[500%] max-w-[380px] rounded-2xl top-[105%] left-0 overflow-hidden">
      <div className="flex flex-col gap-2 lg:gap-4 items-center backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.5] to-[#5A6B8C]/[.5] w-full py-3 lg:py-4">
        <p className="font-[600] text-[12px] lg:text-[16px] text-[#D5E9FF]">
          High Hand
        </p>
        <div className="px-3 grid gap-1 grid-cols-[repeat(5,_minmax(0,_auto))]">
          <img src="/assets/cards/medium/Ah.png" alt="" />
          <img src="/assets/cards/medium/Ac.png" alt="" />
          <img src="/assets/cards/medium/As.png" alt="" />
          <img src="/assets/cards/medium/Ad.png" alt="" />
          <img src="/assets/cards/medium/Ks.png" alt="" />
        </div>
      </div>
      <div className="flex flex-col items-center bg-gradient-to-br from-[#505880] to-[#667AA0] h-full py-2 lg:py-4">
        <p className="font-[600] text-[12px] lg:text-[16px] text-[#D5E9FF]">
          START AT:
        </p>
        <p className="font-[400] text-[20px] lg:text-[24px] text-[#7C95BF] text-shadow">
          01:00:00
        </p>
      </div>
    </div>
  );
};

const TopLeftControllers = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const highhandRef = useRef<HTMLDivElement>(null);
  const [hhOpen, setHhOpen] = useState(false);
  const [mOpen, setMOpen] = useState(false);
  const notify = useContext(ToastrContext);

  const handleMenuClick = () => {
    setMOpen(!mOpen);
  };

  const handleHomeClick = () => {
    notify.info("Comming Soon");
  };

  const handleHhClick = () => {
    setHhOpen(!hhOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      if (mOpen) document.addEventListener("click", handleClickOutside);
      else document.removeEventListener("click", handleClickOutside);
    }, 100);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setMOpen(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (hhOpen) document.addEventListener("click", outHighHand);
      else document.removeEventListener("click", outHighHand);
    }, 100);
    return () => {
      document.removeEventListener("click", outHighHand);
    };
  }, [hhOpen]);

  const outHighHand = (event: MouseEvent) => {
    if (
      highhandRef.current &&
      !highhandRef.current.contains(event.target as Node)
    ) {
      setHhOpen(false);
    }
  };

  return (
    <div
      className={`absolute top-[4%] left-[1.8%] ${
        hhOpen || mOpen ? "z-50" : "z-10"
      } w-[6%]`}
    >
      <div className="relative">
        <img
          className="cursor-pointer rounded-br-full"
          src={
            mOpen
              ? "/assets/buttons/left-top/menu_btn_open.png"
              : "/assets/buttons/left-top/menu_btn.png"
          }
          alt="btn"
          draggable={false}
          onClick={handleMenuClick}
        />
        <img
          className="cursor-pointer absolute top-[24%] left-[75%] rounded-l-full text-[#1a1717]"
          src="/assets/buttons/left-top/home_btn.png"
          alt="btn"
          draggable={false}
          onClick={handleHomeClick}
        />
        <img
          className="cursor-pointer rounded-tr-full"
          src={
            hhOpen
              ? "/assets/buttons/left-top/hh_btn_open.png"
              : "/assets/buttons/left-top/hh_btn.png"
          }
          alt="btn"
          draggable={false}
          onClick={handleHhClick}
        />
        {hhOpen == false && (
          <p className="absolute font-[700] text-[6px] sm:text-[8px] lg:text-[14px] text-[#D5E9FF] opacity-[0.72] pt-3 whitespace-nowrap">
            High Hand
          </p>
        )}
        {mOpen && (
          <div ref={dropdownRef}>
            <Settings />
          </div>
        )}
        {hhOpen && (
          <div ref={highhandRef}>
            <HighHandModal />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopLeftControllers;
