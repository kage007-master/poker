import { ReactComponent as BTC } from "../assets/svg/BTC.svg";
import { ReactComponent as ETH } from "../assets/svg/ETH.svg";
import { ReactComponent as LTC } from "../assets/svg/LTC.svg";
import { ReactComponent as EGLD } from "../assets/svg/EGLD.svg";
import { ReactComponent as KAS } from "../assets/svg/KAS.svg";
import { ReactComponent as ERG } from "../assets/svg/ERG.svg";
import { ReactComponent as XRP } from "../assets/svg/XRP.svg";
import { ReactComponent as BNB } from "../assets/svg/BNB.svg";
import { ReactComponent as USDC } from "../assets/svg/USDC.svg";
import { ReactComponent as USDT } from "../assets/svg/USDT.svg";
import { ReactComponent as MATIC } from "../assets/svg/MATIC.svg";
import { ReactComponent as ADA } from "../assets/svg/ADA.svg";
import { ReactComponent as SOL } from "../assets/svg/SOL.svg";
import { ReactComponent as EBONE } from "../assets/svg/EBONE.svg";

export const initAvatar =
  "https://upcdn.io/W142hJk/image/demo/4mTLJiq7Ke.png?w=600&h=600&fit=max&q=70";

type CoinSVGType = {
  [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export const coinSVG: CoinSVGType = {
  btc: BTC,
  eth: ETH,
  ltc: LTC,
  egld: EGLD,
  kas: KAS,
  erg: ERG,
  xrp: XRP,
  bnb: BNB,
  usdc: USDC,
  usdt: USDT,
  matic: MATIC,
  ada: ADA,
  sol: SOL,
  ebone: EBONE,
};
