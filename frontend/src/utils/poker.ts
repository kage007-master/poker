export const numbersToCards = (nums: number[]) => {
  return nums.map((cardVal) => {
    if (cardVal == -1) return "back";
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

export const numberToSTR = (num: number) => {
  if (num >= 1000000) return num / 1000000 + "M";
  if (num >= 1000) return num / 1000 + "K";
  return num;
};

export const timeToStr = (num: number) => {
  const res = 300 - (num % 300);
  var minutes: any = Math.floor(res / 60);
  var seconds: any = res % 60;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
};
