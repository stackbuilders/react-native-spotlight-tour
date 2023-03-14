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
export function checkValidIntersection(rectangle: Rectangle, circle: Circle): boolean {
  const rectangleCentroid = {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2,
  };

  const circleDistanceX = Math.abs(circle.x - rectangleCentroid.x);
  const circleDistanceY = Math.abs(circle.y - rectangleCentroid.y);

  // Distance between two points formula:
  // https://www.mathsisfun.com/algebra/distance-2-points.html
  const rectangleCircleCentroidXDistance = Math.pow(rectangleCentroid.x - circle.x, 2);
  const rectangleCircleCentroidYDistance = Math.pow(rectangleCentroid.y - circle.y, 2);
  const circleAndRectangleCentroidDistance = Math.sqrt(
    rectangleCircleCentroidYDistance + rectangleCircleCentroidXDistance,
  );

  const isCircleRadiusShorterThanCentroidsDistance = circle.r <= circleAndRectangleCentroidDistance;

  /**
   * This formula verifies if the distance between the rectangle centroid and
   * circle centroid is larger than the circle radius
   */
  const isCentroidsDistanceBiggerThanTheCirclesRadiusSum =
    circleAndRectangleCentroidDistance >= rectangle.height / 2 + circle.r &&
    circleAndRectangleCentroidDistance >= rectangle.width / 2 + circle.r;

  const figuresAreOverlaid =
    isCircleRadiusShorterThanCentroidsDistance &&
    isCentroidsDistanceBiggerThanTheCirclesRadiusSum;

  if (figuresAreOverlaid) {
    return false;
  }

  /**
   * A formula that explains this implementation can be found on:
   * https://math.stackexchange.com/a/2916460
   */
  const relativeCircleRectangleXDistance = Math.pow(circleDistanceX - rectangle.width / 2, 2);
  const relativeCircleRectangleYDistance = Math.pow(circleDistanceY - rectangle.height / 2, 2);
  const cornerDistance = Math.sqrt(
    relativeCircleRectangleXDistance + relativeCircleRectangleYDistance,
  );

  const squaredCornerDistanceIsSmallerThanSquaredCircleRadius =
    Math.pow(cornerDistance, 2) <= Math.pow(circle.r, 2);
  const circleRadiusAndVirtualRectangleRadiusRelation =
    circle.r / Math.max(rectangle.width / 2, rectangle.height / 2) >= 1;

  return (
    squaredCornerDistanceIsSmallerThanSquaredCircleRadius
    && circleRadiusAndVirtualRectangleRadiusRelation
  );
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
    && value instanceof Animated.AnimatedInterpolation<number>;
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
