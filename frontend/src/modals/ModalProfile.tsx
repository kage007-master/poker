import { useContext, useState } from "react";
import Modal from "react-modal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "store/modal.slice";
import { useGetAccountInfo } from "hooks/sdkDappHooks";
import { initAvatar } from "config/const";
import { ToastrContext } from "providers/ToastrProvider";
import axios from "axios";
import { getNfts, setUser } from "store/auth.slice";
import { AppDispatch, RootState } from "store";
import env from "../config";

Modal.setAppElement("body");

const ModalProfile = () => {
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(initAvatar);
  const notify = useContext(ToastrContext);
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.profile);
  const account = useGetAccountInfo();
  const auth = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(auth.user.name);
      setAvatar(auth.user.avatar);
      dispatch(getNfts(auth.user.address));
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (name && error === "name") setError("");
    return () => {};
  }, [name]);

  const handleProfile = async () => {
    if (!name) {
      setError("name");
      return notify.error("Username required!");
    }
    if (!avatar) return notify.error("Please select your Avatar!");
    try {
      const result = await axios.post(env.authURL + "/auth/profile", {
        address: account.address,
        name,
        avatar,
      });
      if (result && result.status === 200) {
        dispatch(setUser(result.data));
        notify.success("Successfully Changed!");
        dispatch(setProfile(false));
      }
    } catch (errors: any) {
      console.log(errors);
      if (errors.response.status === 400)
        notify.error(errors.response.data.errors[0].msg);
      else notify.error("Server Error!");
    }
  };
  return (
    <Modal
      id="modalAuth"
      isOpen={isOpen}
      onRequestClose={() => {
        dispatch(setProfile(false));
      }}
      className="modal-fade modal-content text-sm md:text-base"
      overlayClassName="bg-[rgba(14,18,36,.7)] fixed w-full h-full top-0 left-0 backdrop-blur-xl z-50"
      contentLabel="Sign Up"
    >
      <div className="flex items-center ">
        <img src="/assets/ddog.png" className="w-10 lg:w-20"></img>
        <h1 className="text-2xl lg:text-4xl text-bright pl-2">
          User Information
        </h1>
      </div>

      <div className="rounded-2xl mt-6 overflow-hidden">
        <div className="flex flex-col gap-2 lg:gap-4 items-center backdrop-blur-lg bg-gradient-to-br from-[#444B6B]/[.5] to-[#5A6B8C]/[.5] w-full h-max p-3 lg:p-4">
          <div className="flex items-center">
            <img src={avatar} className="w-20 h-20 border rounded-full"></img>
            <input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
              className={`h-[56px] mx-4 p-4 rounded-md bg-transparent outline-none text-center text-bright border-border border w-full placeholder:text-center focus:border-indigo anim ${
                error === "name" && "border-tomato"
              }`}
              placeholder="Username"
            ></input>
          </div>
          <p>Select your Avatar</p>
          <div className="w-full flex overflow-auto">
            <div className="min-w-[128px] w-32 mx-2">
              <img
                src={initAvatar}
                className="w-full border rounded-full cursor-pointer"
                onClick={() => setAvatar(initAvatar)}
              />
              Hidden
            </div>
            {auth.nfts.map((item: any) => {
              return (
                <div className="min-w-[128px] w-32 mx-2">
                  <img
                    src={item.url}
                    className="w-full border rounded-full cursor-pointer"
                    onClick={() => setAvatar(item.url)}
                  />
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center bg-gradient-to-br from-[#505880] to-[#667AA0] h-full py-2 lg:py-4">
          <button onClick={handleProfile}>
            <img className="w-[80%] mx-auto" src="assets/buttons/save.png" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalProfile;
