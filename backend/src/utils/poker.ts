import MersenneTwister from "mersenne-twister";
import { IPlayer } from "../types/poker";
import authController from "../controllers/auth.controller";

const randGenerator = new MersenneTwister();

export const COUNT_DOWN = 12;
export const ANIMATION_DELAY_TIME = 1100;

export const rand = (n: number) => {
  return randGenerator.random_int() % n;
};

export const setSeed = (seed?: number) => {
  if (!seed) seed = Number(new Date());
  randGenerator.init_seed(seed);
};

export const shuffledCards = () => {
  let cards: number[] = [];
  for (let i = 0; i < 52; i++) cards[i] = i;
  for (let i = 51; i >= 0; i--) {
    let j = rand(i + 1);
    let tmp = cards[i];
    cards[i] = cards[j];
    cards[j] = tmp;
  }
  return cards;
};

export const nextActivePlayerId = (id: number, players: IPlayer[]) => {
  do {
    id = (id + 1) % 6;
  } while (!isActive(players[id]));
  return id;
};

export const isValid = (player: IPlayer) => {
  if (player && player.address) return true;
  return false;
};

export const isActive = (player: IPlayer) => {
  if (player && player.address) {
    if (player.status != "FOLD" && player.status != "JOIN") return true;
  }
  return false;
};

export const numberOfPlayers = (players: IPlayer[]) => {
  let count: number = 0;
  for (let i = 0; i < 6; i++) count += Number(isValid(players[i]));
  return count;
};

export const numberOfActivePlayers = (players: IPlayer[]) => {
  let count: number = 0;
  for (let i = 0; i < 6; i++) count += Number(isActive(players[i]));
  return count;
};

export const playersInfo = async (players: IPlayer[], viewer: string) => {
  let result: IPlayer[] = [];
  for (let player of players) {
    result.push(await playerInfo(player, viewer));
  }
  return result;
};

export const playerInfo = async (player: IPlayer, viewer: string) => {
  if (!player.address) return player;
  const { socket, ...remain } = player;
  let result = JSON.parse(JSON.stringify(remain));
  if (result.cards.length == 2 && player.address != viewer && viewer != "all")
    result.cards = [-1, -1];
  if (player.status == "FOLD") result.cards = [];
  const user = await authController.getUser(remain.address);
  if (user) {
    result.avatar = user.avatar;
    result.name = user.name;
  }
  return result;
};

export const nullPlayer = () => {
  return {
    address: "",
    avatar: "",
    stack: 0,
    betAmount: 0,
    totalBet: 0,
    position: -1,
    status: "",
    cards: [],
    disconnect: true,
    leave: false,
    addchip: 0,
    auto: "",
  };
};

export const numbersToCards = (nums: number[]) => {
  return nums.map((cardVal) => {
    const suit = ["h", "s", "d", "c"][Math.floor(cardVal / 13)];
    cardVal %= 13;
    let val = `${cardVal + 1}`; // A -> 1
    switch (cardVal) {
      case 0:
        val = "A";
        break;
      case 9:
        val = "T";
        break;
      case 10:
        val = "J";
        break;
      case 11:
        val = "Q";
        break;
      case 12:
        val = "K";
        break;
    }
    return val + suit;
  });
};
