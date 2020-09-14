import React from "react";
import { ReactTestInstance } from "react-test-renderer";

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Circle = {
  y: number;
  x: number;
  r: number;
};

export function checkValidIntersection(rectangle: Rectangle, circle: Circle): boolean {
  const rectangleCentroid = {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2
  };

  const circleDistanceX = Math.abs(circle.x - rectangleCentroid.x);
  const circleDistanceY = Math.abs(circle.y - rectangleCentroid.y);

  const circleAndRectangleCentroidDistance = Math.sqrt(
    Math.pow(rectangleCentroid.y - circle.y, 2) +
      Math.pow(rectangleCentroid.x - circle.x, 2)
  );

  const isCircleRadiusShorterThanCentroidsDistance = circle.r <= circleAndRectangleCentroidDistance;
  const isCentroidsDistanceBiggerThanTheCirclesRadiusSum =
    circleAndRectangleCentroidDistance >= rectangle.height / 2 + circle.r &&
    circleAndRectangleCentroidDistance >= rectangle.width / 2 + circle.r;

  const figuresAreOverlaid =
    isCircleRadiusShorterThanCentroidsDistance &&
    isCentroidsDistanceBiggerThanTheCirclesRadiusSum;

  if (figuresAreOverlaid) {
    return false;
  }

  const cornerDistance = Math.sqrt(
    Math.pow(circleDistanceX - rectangle.width / 2, 2) +
      Math.pow(circleDistanceY - rectangle.height / 2, 2)
  );

  const squaredCornerDistanceIsSmallerThanSquaredCircleRadius =
    Math.pow(cornerDistance, 2) <= Math.pow(circle.r, 2);
  const circleRadiusAndVirtualRectangleRadiusRelation =
    circle.r / Math.max(rectangle.width / 2, rectangle.height / 2) >= 1;

  return (
    squaredCornerDistanceIsSmallerThanSquaredCircleRadius &&
    circleRadiusAndVirtualRectangleRadiusRelation
  );
}

type ChildProps = { [key: string]: any };

function isReactTestInstance(child: ReactTestInstance | string): child is ReactTestInstance {
  return typeof child !== "string";
}

function isReactProps(props: React.PropsWithChildren<ChildProps> | null): props is React.PropsWithChildren<ChildProps> {
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
