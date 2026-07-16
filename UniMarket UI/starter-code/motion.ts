export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export const motionDurations = {
  micro: 0.16,
  card: 0.22,
  panel: 0.3,
  page: 0.4,
  signature: 0.62,
};

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -2, scale: 1.002 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
