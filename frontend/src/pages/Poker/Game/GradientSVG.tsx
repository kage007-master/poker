const GradientSVG = () => {
  return (
    <svg style={{ height: 0, position: "absolute" }}>
      <linearGradient id="gradient0">
        <stop offset="0%" stopColor="#FF4493" />
        <stop offset="50%" stopColor="#9746FF" />
        <stop offset="100%" stopColor="#FFAE74" />
      </linearGradient>
      <linearGradient id="gradient1">
        <stop offset="0%" stopColor="#4457FF" />
        <stop offset="50%" stopColor="#46C8FF" />
        <stop offset="100%" stopColor="#77FF74" />
      </linearGradient>
    </svg>
  );
};

export default GradientSVG;
