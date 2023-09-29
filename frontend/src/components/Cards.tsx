const MediumCard = (props: any) => {
  return (
    <div className="card-bg w-full aspect-[1/1.46] relative flex items-center justify-center">
      <img
        className="absolute top-[5%] left-[10%] w-[28%]"
        src={`/assets/cards/${props.card.suit}.png`}
        alt=""
      />
      <p className={`gradient-text-${props.card.suit} text-card font-[900]`}>
        {props.card.value}
      </p>
      <img
        className="absolute bottom-[5%] right-[10%] w-[28%]"
        src={`/assets/cards/${props.card.suit}.png`}
        alt=""
      />
    </div>
  );
};

export { MediumCard };
