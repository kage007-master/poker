import "./App.css";
import MultiversXProvider from "./providers/MultiversXProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import ToastrProvider from "./providers/ToastrProvider";
import Modals from "modals";
import PokerRooms from "pages/Poker/Room";
import PokerGame from "pages/Poker/Game";

import { SocketContext, pokersocket } from "context/socket";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "components/LogIn";
import MessageProvider from "providers/MessageProvider";

function App() {
  return (
    <MultiversXProvider>
      <Provider store={store}>
        <ToastrProvider>
          <SocketContext.Provider value={{ pokersocket }}>
            <BrowserRouter>
              <MessageProvider />
              <div
                className="w-screen h-screen bg-center bg-cover bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(/assets/background.svg)` }}
              >
                <div className="flex sm:hidden justify-center flex-col items-center w-full h-full">
                  <img
                    className="w-[50%] max-h-[75%] z-50"
                    src="/assets/rotate.gif"
                    alt=""
                  />
                  <div className="w-[80%] gradient-text text-[24px] text-center">
                    Please Rotate Your Phone For Better Experience
                  </div>
                </div>
                <div className="flex justify-center items-center w-full h-full px-[2%] 2xl:px-[9%]">
                  <div className="flex justify-center items-center relative">
                    <img
                      className="select-none z-10 drop-shadow-[60px_50px_60px_rgba(0,0,0,.4)]"
                      src="/assets/table/empty.png"
                      alt="table"
                      draggable={false}
                    />
                    <Routes>
                      <Route path="/" element={<PokerRooms />} />
                      <Route path="/game/:id" element={<PokerGame />} />
                    </Routes>
                  </div>
                </div>
              </div>
              <Modals />
              <LogIn />
            </BrowserRouter>
          </SocketContext.Provider>
        </ToastrProvider>
      </Provider>
    </MultiversXProvider>
  );
}

export default App;
