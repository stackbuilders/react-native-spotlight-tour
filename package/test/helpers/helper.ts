import { PropsWithChildren } from "react";
import { Animated } from "react-native";
import { ReactTestInstance } from "react-test-renderer";

interface Rectangle {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface Circle {
  r: number;
  x: number;
  y: number;
}

/**
 * The explanation of the formulas used are available on following the
 * document:
 * https://docs.google.com/document/d/1rrfTB7NN4r1HItxiPni83TvL-up3OYXt0dgLOsO9Sg0/edit?usp=sharing
 *
 * Rectangles centroid formula:
 * https://www.engineeringintro.com/mechanics-of-structures/centre-of-gravity/centroid-of-rectangle/
 */
export function checkValidIntersection(rectangle: Rectangle, circle: Circle): void {
  const rectCenter = {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2,
  };

  // Distance between two points formula:
  // https://www.mathsisfun.com/algebra/distance-2-points.html
  const rectangleCircleCentroidXDistance = Math.pow(rectCenter.x - circle.x, 2);
  const rectangleCircleCentroidYDistance = Math.pow(rectCenter.y - circle.y, 2);
  const circleAndRectangleCentroidDistance = Math.sqrt(
    rectangleCircleCentroidYDistance + rectangleCircleCentroidXDistance,
  );

  const isCircleRadiusShorterThanCentroidsDistance = circle.r <= circleAndRectangleCentroidDistance;

  /**
   * This formula verifies if the distance between the rectangle centroid and
   * circle centroid is larger than the circle radius
   */
  const isCentroidsDistanceBiggerThanTheCirclesRadiusSum
    = circleAndRectangleCentroidDistance >= rectangle.height / 2 + circle.r
    && circleAndRectangleCentroidDistance >= rectangle.width / 2 + circle.r;

  const figuresAreOverlaid
    = isCircleRadiusShorterThanCentroidsDistance
    && isCentroidsDistanceBiggerThanTheCirclesRadiusSum;

  if (figuresAreOverlaid) {
    throw Error("Figures are overlaid!");
  }

  if (rectCenter.x !== circle.x || rectCenter.y !== circle.y) {
    throw Error(
      `Circle center (${circle.x}, ${circle.y}) is not the same as `
      + `square center (${rectCenter.x}, ${rectCenter.y})`,
    );
  }

  const rectRadiusX = Math.abs(rectCenter.x - (rectangle.width / 2));
  const rectRadiusY = Math.abs(rectCenter.y - (rectangle.height / 2));
  const rectRadiusMax = Math.max(rectRadiusX, rectRadiusY);

  if (rectRadiusMax > circle.r) {
    throw Error(`Rectangle radius (${rectRadiusMax}) is greater than the circle radius (${circle.r})`);
  }

  const relation = circle.r / Math.max(rectangle.width / 2, rectangle.height / 2);

  if (relation < 1) {
    throw Error(`Circle vs. rectangle relation ${relation} is not greater that 1`);
  }
}

function isReactTestInstance(child: ReactTestInstance | string): child is ReactTestInstance {
  return typeof child !== "string";
}

function isReactProps<T extends object>(
  props: PropsWithChildren<T> | null,
): props is PropsWithChildren<T> {
  return typeof props === "object";
}

export function findPropsOnTestInstance<P>(
  reactTestInstance: ReactTestInstance,
  componentName: string,
): PropsWithChildren<P> {
  const findInsideChild = <T extends P>(
    childReactTestInstance: ReactTestInstance,
    depth: number,
  ): Array<PropsWithChildren<T> | null> => {
    if (!isReactTestInstance(childReactTestInstance) || depth <= 0) {
      return [null];
    }

    if (childReactTestInstance.type === componentName) {
      return [childReactTestInstance.props as PropsWithChildren<T>];
    }

    return childReactTestInstance.children.map(nestedChild =>
      isReactTestInstance(nestedChild)
        ? findInsideChild(nestedChild, depth - 1)
        : null,
    ) as Array<PropsWithChildren<T> | null>;
  };

  const props = findInsideChild(reactTestInstance, 20)
    .flat(Infinity)
    .filter(item => !!item)[0];

  return props !== undefined && isReactProps(props)
    ? props as PropsWithChildren<P>
    : { } as PropsWithChildren<P>;
}

type AnimatedValue = Animated.SpringAnimationConfig["toValue"];

type TimingAnimatedValue = Animated.AnimatedInterpolation<number> | AnimatedValue;

export function isAnimatedTimingInterpolation(
  value: TimingAnimatedValue,
): value is Animated.AnimatedInterpolation<number> {
  return typeof value === "object"
    && value instanceof Animated.AnimatedInterpolation;
}

export function isAnimatedValue(value: AnimatedValue): value is Animated.Value {
  return typeof value === "object"
    && value instanceof Animated.Value;
}

export function isAnimatedValueXY(value: Animated.Value | Animated.ValueXY): value is Animated.ValueXY {
  return typeof value === "object"
    && value instanceof Animated.ValueXY;
}

export function isXYValue(value: AnimatedValue): value is { x: number; y: number; } {
  return typeof value === "object"
    && !(value instanceof Animated.ValueXY)
    && "x" in value
    && "y" in value;
}

export function isNumberValue(value: AnimatedValue): value is number {
  return typeof value === "number";
}
