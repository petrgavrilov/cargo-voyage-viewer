import { RoutePoint } from '../../models/route.interface';

export const getMinMaxSpeed = (points: RoutePoint[]): [number, number] => {
  const speeds = points
    .map((point) => point.speed)
    .map<number>((speed) => (speed === null ? 0 : speed));
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  return [minSpeed, maxSpeed];
};

// limit extreme speed values
// by replacing them with the lower or upper bound
// to reduce the impact of outliers
export const winsorizePoints = (points: RoutePoint[]): RoutePoint[] => {
  const speedValues = points
    .map((point) => point.speed)
    .filter((speed) => speed !== null) as number[];

  const sortedValues = speedValues.sort((a, b) => a - b);
  const lowerQuantile = getQuantile(sortedValues, 0.25);
  const upperQuantile = getQuantile(sortedValues, 0.75);
  const interQuartileRange = upperQuantile - lowerQuantile;

  const lowerBound = lowerQuantile - 1.5 * interQuartileRange;
  const upperBound = upperQuantile + 1.5 * interQuartileRange;

  return points.map((point) => {
    if (point.speed === null) {
      return point;
    }

    return {
      ...point,
      speed: Math.max(lowerBound, Math.min(upperBound, point.speed)),
    };
  });
};

export const getQuantile = (
  sortedValues: number[],
  percentile: number
): number => {
  // calculate the index of the value that corresponds to the given percentile
  const index = (sortedValues.length - 1) * percentile;
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);

  // if lowerIndex and upperIndex are the same, we don't need to interpolate
  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  }

  // the percentile falls between two numbers in the array
  // linear interpolation is used to calculate the value
  // which gives a weighted average of the two numbers
  const lowerValue = sortedValues[lowerIndex];
  const upperValue = sortedValues[upperIndex];
  const weight = index - lowerIndex;

  return lowerValue + weight * (upperValue - lowerValue);
};

export const calculateColor = (
  speed: number,
  minSpeed: number,
  maxSpeed: number
): string => {
  // make sure the speed is within the bounds
  const clampedSpeed = Math.max(minSpeed, Math.min(speed, maxSpeed));
  // normalize the speed to a value between 0 and 1
  const normalizedSpeed = (clampedSpeed - minSpeed) / (maxSpeed - minSpeed);
  // red component is 255 when the speed is 0
  // and decreases as the speed increases
  const red = 255 * (1 - normalizedSpeed);
  // green component is 255 when the speed is max
  // and decreases as the speed decreases
  const green = 255 * normalizedSpeed;

  return `rgba(${red}, ${green}, 0)`;
};
