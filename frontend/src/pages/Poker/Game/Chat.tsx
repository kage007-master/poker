import { useState } from "react";

const ChatModal = () => {
  const messages: Message[] = [
    { sender: { avatar: "/assets/avatar.jpg" }, message: "Cool!" },
    { sender: { avatar: "/assets/avatar.jpg" }, message: "Let's Rock!" },
    { sender: { avatar: "/assets/avatar.jpg" }, message: "Congratulations!" },
    {
      sender: { avatar: "/assets/avatar.jpg" },
      message: "Congratulations!",
      me: true,
    },
    {
      sender: { avatar: "/assets/avatar.jpg" },
      message: "Congratulations!",
      me: true,
    },
    {
      sender: { avatar: "/assets/avatar.jpg" },
      message: "CongratulatiCongratulatiasdf ons !",
      me: true,
    },
  ];

  return (
    <div className="absolute w-[320px] lg:w-[380px] h-max rounded-2xl bottom-[110%] left-0 overflow-hidden text-[10px] lg:text-[14px]">
      <div className="flex flex-col gap-2 lg:gap-4 backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.8] to-[#5A6B8C]/[.8] w-full h-max py-4 px-4 overflow-y-auto overflow-x-hidden max-h-[200px] lg:max-h-[250px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 items-center ${
              message.me ? "place-self-end" : "place-self-start"
            }`}
          >
            <img
              className={`relative ${
                message.me ? "order-1" : "order-0"
              } z-10 w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full drop-shadow-[-2px_-2px_4px_rgba(0,0,0,.3)]`}
              src={message.sender.avatar}
              alt=""
            />
            <p
              className={`relative ${
                message.me ? "-right-[35px]" : "-left-[35px]"
              } py-2 ${
                message.me ? "pl-4 pr-10" : "pr-4 pl-10"
              } bg-[#5A6B8C]/[.5] text-[#D4E9FF] font-[500] ${
                message.me ? "rounded-l-full" : "rounded-r-full"
              }`}
            >
              {message.message}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 bg-gradient-to-br from-[#505880] to-[#667AA0] h-full py-4 px-4 place-items-center w-full overflow-x-auto">
        {/* <img className="cursor-pointer" src="/assets/icons/clock.png" alt="" />
        <img className="cursor-pointer" src="/assets/icons/smile.png" alt="" />
        <p className="py-2 px-4 bg-[#5A6B8C]/[.2] mix-blend-screen text-[#D4E9FF] font-[500] rounded-full cursor-pointer whitespace-nowrap">
          Well Played!
        </p> */}
        <input
          type="text"
          className="bg-transparent outline-none w-full border rounded-md p-2 text-white"
          placeholder="Your messages here..."
        ></input>
      </div>
    </div>
  );
};

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const handleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <div
      className={`absolute bottom-[3%] left-[1.8%] ${
        chatOpen ? "z-50" : "z-10"
      } w-[6%]`}
    >
      <img
        className={"cursor-pointer"}
        src={
          chatOpen
            ? "/assets/buttons/left-bottom/chat_btn_open.png"
            : "/assets/buttons/left-bottom/chat_btn.png"
        }
        alt="btn"
        draggable={false}
        onClick={handleChat}
      />
      {chatOpen && <ChatModal />}
    </div>
  );
};

export default Chat;
