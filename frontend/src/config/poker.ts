const dev = 1;

export const constGame = {
  time_card_move: 20 * dev,
  time_card_raise: 30 * dev,
  time_card_delay: 20 * dev,
  time_chip_bet: 20 * dev,
  time_chip_over: 20 * dev,
  time_community_card: 20 * dev,
  time_community_turn: 10 * dev,
  time_timer_duration: 60 * dev,
  time_chip_reward: 50 * dev,
};

export const gameStates = {
  preLoading: "PRELOADING",
  preWaiting: "WAIT",
  preflop: "PREFLOP",
  active: "ACTIVE",
  bigBlind: "BIG_BLIND",
  smallBlind: "SMALL_BLIND",
  check: "CHECK",
  bet: "BET",
  wait: "IDLE",
  flop: "FLOP",
  turn: "TURN",
  river: "RIVER",
  final: "FINAL",
  over: "OVER",
  join: "JOIN",
  fold: "FOLD",
};

export const constPositions = {
  table: {
    x: 310,
    y: 210,
    w: 1300,
    h: 680,
  },
  buttons: {
    x: 960,
    y: 977,
    w: 958,
    h: 102,
  },
  button: {
    w: 300,
    h: 80,
  },
  pot: {
    x: 960,
    y: 480,
  },
  community: [
    { x: 760, y: 580, w: 84, h: 118 },
    { x: 860, y: 580, w: 84, h: 118 },
    { x: 960, y: 580, w: 84, h: 118 },
    { x: 1060, y: 580, w: 84, h: 118 },
    { x: 1160, y: 580, w: 84, h: 118 },
  ],
  players: [
    {
      avatar: { x: 840, y: 910, w: 100, h: 100 },
      information: { x: 960, y: 910, w: 340, h: 100 },
      dealer: { x: 850, y: 750, w: 38, h: 38 },
      chip: { x: 940, y: 700, w: 38, h: 33 },
      card: {
        x: 0,
        y: -110,
        i: 90,
        w: 100,
        h: 143,
      },
    },
    {
      avatar: { x: 365, y: 710, w: 50, h: 50 },
      information: { x: 420, y: 710, w: 160, h: 50 },
      dealer: { x: 560, y: 700, w: 38, h: 38 },
      chip: { x: 640, y: 680, w: 38, h: 33 },
      card: {
        x: -30,
        y: -60,
        i: 60,
        w: 70,
        h: 100,
      },
    },
    {
      avatar: { x: 365, y: 380, w: 50, h: 50 },
      information: { x: 420, y: 380, w: 160, h: 50 },
      dealer: { x: 550, y: 420, w: 38, h: 38 },
      chip: { x: 640, y: 400, w: 38, h: 33 },
      card: {
        x: -30,
        y: -60,
        i: 60,
        w: 70,
        h: 100,
      },
    },
    {
      avatar: { x: 905, y: 260, w: 50, h: 50 },
      information: { x: 960, y: 260, w: 160, h: 50 },
      dealer: { x: 860, y: 350, w: 38, h: 38 },
      chip: { x: 940, y: 400, w: 38, h: 33 },
      card: {
        x: -30,
        y: -60,
        i: 60,
        w: 70,
        h: 100,
      },
    },
    {
      avatar: { x: 1425, y: 380, w: 50, h: 50 },
      information: { x: 1480, y: 380, w: 160, h: 50 },
      dealer: { x: 1370, y: 420, w: 38, h: 38 },
      chip: { x: 1280, y: 400, w: 38, h: 33 },
      card: {
        x: -30,
        y: -60,
        i: 60,
        w: 70,
        h: 100,
      },
    },
    {
      avatar: { x: 1425, y: 710, w: 50, h: 50 },
      information: { x: 1480, y: 710, w: 160, h: 50 },
      dealer: { x: 1340, y: 710, w: 38, h: 38 },
      chip: { x: 1280, y: 680, w: 38, h: 33 },
      card: {
        x: -30,
        y: -60,
        i: 60,
        w: 70,
        h: 100,
      },
    },
  ],
};

export const constAnimations = {
  card: {
    idle: "IDLE",
    preflop: "PREFLOP",
    raise: "RAISE",
    hide: "HIDE",
  },
  community: {
    idle: "IDLE",
    show: "SHOW",
    rotate: "ROTATE",
  },
  chip: {
    idle: "IDLE",
    bet: "BET",
    over: "OVER",
    reward: "REWARD",
    beted: "BETED",
  },
};
