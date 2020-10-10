import * as React from "react";
import { Animated } from "react-native";
import { ReactTestInstance } from "react-test-renderer";

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Circle {
  y: number;
  x: number;
  r: number;
}

export function checkValidIntersection(rectangle: Rectangle, circle: Circle): boolean {
  /**
   * The explanation of the formulas used are available on following the document:
   * https://docs.google.com/document/d/1rrfTB7NN4r1HItxiPni83TvL-up3OYXt0dgLOsO9Sg0/edit?usp=sharing
   */

  /**
   * Rectangles centroid formula:
   * https://www.engineeringintro.com/mechanics-of-structures/centre-of-gravity/centroid-of-rectangle/
   */

  const rectangleCentroid = {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2
  };

  const circleDistanceX = Math.abs(circle.x - rectangleCentroid.x);
  const circleDistanceY = Math.abs(circle.y - rectangleCentroid.y);

  // Distance between two points formula:
  // https://www.mathsisfun.com/algebra/distance-2-points.html
  const rectangleCircleCentroidXDistance = Math.pow(rectangleCentroid.x - circle.x, 2);
  const rectangleCircleCentroidYDistance = Math.pow(rectangleCentroid.y - circle.y, 2);
  const circleAndRectangleCentroidDistance = Math.sqrt(
    rectangleCircleCentroidYDistance + rectangleCircleCentroidXDistance
  );

  const isCircleRadiusShorterThanCentroidsDistance = circle.r <= circleAndRectangleCentroidDistance;

  // This formula verifies if the distance between the rectangle centroid and circle centroid
  // is larger than the circle radius
  const isCentroidsDistanceBiggerThanTheCirclesRadiusSum =
    circleAndRectangleCentroidDistance >= rectangle.height / 2 + circle.r &&
    circleAndRectangleCentroidDistance >= rectangle.width / 2 + circle.r;

  const figuresAreOverlaid =
    isCircleRadiusShorterThanCentroidsDistance &&
    isCentroidsDistanceBiggerThanTheCirclesRadiusSum;

  if (figuresAreOverlaid) {
    return false;
  }

  // A formula that explains this implementation can be found on
  // https://math.stackexchange.com/a/2916460
  const relativeCircleRectangleXDistance = Math.pow(circleDistanceX - rectangle.width / 2, 2);
  const relativeCircleRectangleYDistance = Math.pow(circleDistanceY - rectangle.height / 2, 2);
  const cornerDistance = Math.sqrt(
    relativeCircleRectangleXDistance + relativeCircleRectangleYDistance
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

type ChildProps = { [key: string]: any };

function isReactTestInstance(child: ReactTestInstance | string): child is ReactTestInstance {
  return typeof child !== "string";
}

function isReactProps<T extends object>(
  props: React.PropsWithChildren<T> | null
): props is React.PropsWithChildren<T> {
  return typeof props === "object";
}

export function findPropsOnTestInstance(
  reactTestInstance: ReactTestInstance,
  componentName: string
): React.PropsWithChildren<ChildProps> {
  const findInsideChild = (
    childReactTestInstance: ReactTestInstance,
    depth: number
  ): (React.PropsWithChildren<ChildProps> | null)[] => {
    if (!isReactTestInstance(childReactTestInstance) || depth <= 0) {
      return [null];
    }

    if (childReactTestInstance.type === componentName) {
      return [childReactTestInstance.props];
    }

    const children: Array<ReactTestInstance | string> = childReactTestInstance.children;

    return children.map(nestedChild =>
      isReactTestInstance(nestedChild)
        ? findInsideChild(nestedChild, depth - 1)
        : null
    );
  };

  const props = findInsideChild(reactTestInstance, 20)
    .flat(Infinity)
    .filter(item => !!item)[0];

  return isReactProps(props) ? props : {};
}

type AnimatedValue = number | Animated.AnimatedValue | { x: number; y: number } | Animated.AnimatedValueXY;

type TimingAnimatedValue = Animated.AnimatedInterpolation | AnimatedValue;

export function isAnimatedTimingInterpolation(value: TimingAnimatedValue): value is Animated.AnimatedInterpolation {
  return Animated.AnimatedInterpolation && value instanceof Animated.AnimatedInterpolation;
}

export function isAnimatedValue(value: AnimatedValue): value is Animated.Value {
  return value instanceof Animated.Value;
}

export function isAnimatedValueXY(value: Animated.Value | Animated.ValueXY): value is Animated.ValueXY {
  return value instanceof Animated.ValueXY;
}

export function isXYValue(value: AnimatedValue): value is { x: number; y: number } & number {
  return !(value instanceof Animated.Value)
    && !(value instanceof Animated.ValueXY)
    && (typeof value === "number" || (typeof value !== "number" && !!(value?.x && value?.y)));
}

export function isNumberValue(value: AnimatedValue): value is number {
  return typeof value === "number";
}
