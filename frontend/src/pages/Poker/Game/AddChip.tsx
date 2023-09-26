import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setAddChip } from "store/modal.slice";

const AddChip = () => {
  const dispatch = useDispatch();
  const { tableInfo } = useSelector((state: RootState) => state.poker);
  const onAdd = () => {
    if (tableInfo.type !== "Turbo SNG") {
      dispatch(setAddChip(6));
    }
  };
  if (!tableInfo.isMember) return null;
  return (
    <div className="absolute bottom-[3%] left-[9.5%] h-[6.5%] z-30 pl-[0.4%] pt-[0.4%] pb-[0.2%] rounded-full bg-[#414C6D] flex gap-1 items-center">
      <img className="h-full" src="/assets/chips/blue_chip.png" alt="" />
      <p className="font-[700] text-[#D4E9FF]">{tableInfo.players[0].stack}</p>
      <img className="pic" src="/assets/pic.png" alt="" />
      <img
        className="h-[125%] ml-1 cursor-pointer"
        src={`/assets/buttons/add-chip${
          tableInfo.type === "Turbo SNG" ? "-dis" : ""
        }.png`}
        alt=""
        onClick={onAdd}
      />
    </div>
  );
};

export default AddChip;
