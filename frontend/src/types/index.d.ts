type TCoin =
  | "btc"
  | "eth"
  | "ltc"
  | "egld"
  | "kas"
  | "erg"
  | "xrp"
  | "bnb"
  | "usdc"
  | "usdt"
  | "matic"
  | "ada"
  | "sol"
  | "ebone";

type Player = {
  address?: string;
  avatar: string;
};

type Message = {
  sender: Player;
  message: string;
  me?: boolean;
};
