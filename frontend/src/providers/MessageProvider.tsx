import { SocketContext } from "context/socket";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { newMessage } from "store/poker.slice";

const MessageProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pokersocket } = useContext(SocketContext);
  const address = useSelector((state: RootState) => state.auth.user.address);

  useEffect(() => {
    pokersocket.on("message", (data: any) => {
      dispatch(newMessage({ ...data, me: data.address === address }));
    });
    return () => {
      pokersocket.off("message");
    };
  });
  return null;
};

export default MessageProvider;
