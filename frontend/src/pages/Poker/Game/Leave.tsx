import { SocketContext } from "context/socket";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "store";

const Leave = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pokersocket } = useContext(SocketContext);
  const { address } = useSelector((state: RootState) => state.auth.user);
  const { tableInfo } = useSelector((state: RootState) => state.poker);
  const handleChat = () => {
    pokersocket.emit("leaveTable", { id, address });
    navigate("/");
  };

  return (
    <div className="absolute top-[4%] right-[1.8%] z-10 w-[6%] cursor-pointer">
      <img
        src="/assets/buttons/leave.svg"
        alt="btn"
        draggable={false}
        onClick={handleChat}
      />
    </div>
  );
};

export default Leave;
