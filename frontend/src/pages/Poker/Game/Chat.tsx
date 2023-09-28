import { SocketContext } from "context/socket";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

const ChatModal = () => {
  const [text, setText] = useState("");
  const { pokersocket } = useContext(SocketContext);
  const auth = useSelector((state: RootState) => state.auth);
  const messages = useSelector((state: RootState) => state.poker.messages);
  const sendMessage = () => {
    if (!text) return;
    pokersocket.emit("message", {
      text,
      avatar: auth.user.avatar,
      address: auth.user.address,
    });
    setText("");
  };
  return (
    <div className="absolute w-[320px] lg:w-[380px] h-max rounded-2xl bottom-[110%] left-0 overflow-hidden">
      <div className="flex flex-col gap-2 lg:gap-4 backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.8] to-[#5A6B8C]/[.8] w-full min-h-[200px] lg:min-h-[250px] h-max py-4 px-4 overflow-y-auto overflow-x-hidden max-h-[200px] lg:max-h-[250px]">
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
              src={message.avatar}
              alt=""
            />
            <p
              className={`relative ${
                message.me
                  ? "-right-[40px] lg:-right-[48px]"
                  : "-left-[40px] lg:-left-[48px]"
              } py-2 ${
                message.me ? "pl-4 pr-10 lg:pr-12 " : "pr-4 pl-10 lg:pl-12"
              } bg-[#5A6B8C]/[.5] text-[#D4E9FF] font-[500] ${
                message.me ? "rounded-full" : "rounded-full"
              }`}
            >
              {message.text}
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
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.code === "Enter") sendMessage();
          }}
        />
      </div>
    </div>
  );
};

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleChat = () => {
    setChatOpen(!chatOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      if (chatOpen) document.addEventListener("click", outHighHand);
      else document.removeEventListener("click", outHighHand);
    }, 100);
    return () => {
      document.removeEventListener("click", outHighHand);
    };
  }, [chatOpen]);

  const outHighHand = (event: MouseEvent) => {
    if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
      setChatOpen(false);
    }
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
      {chatOpen && (
        <div ref={chatRef}>
          <ChatModal />
        </div>
      )}
    </div>
  );
};

export default Chat;
