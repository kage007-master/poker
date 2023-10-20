import { SocketContext } from "context/socket";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { setBalance } from "store/auth.slice";
import { newMessage, setHHand } from "store/poker.slice";

const MessageProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pokersocket } = useContext(SocketContext);
  const address = useSelector((state: RootState) => state.auth.user.address);

  useEffect(() => {
    pokersocket.on("HighHand", (data: any) => {
      console.log(data);
      dispatch(setHHand(data));
    });
    pokersocket.on("balance", (amount: number) => {
      dispatch(setBalance({ chain: "ebone", amount }));
    });
    pokersocket.on("message", (data: any) => {
      dispatch(newMessage({ ...data, me: data.address === address }));
    });
    return () => {
      pokersocket.off("message");
      pokersocket.off("HighHand");
      pokersocket.off("balance");
    };
  });
  return null;
};

export default MessageProvider;
