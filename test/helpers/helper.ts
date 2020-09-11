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

export function checkValidIntersection(
  rectangle: Rectangle,
  circle: Circle
): boolean {
  const circleDistanceX = Math.abs(circle.x - rectangle.x);
  const circleDistanceY = Math.abs(circle.y - rectangle.y);

  const rectangleCentroid = {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2
  };

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

  const cornerDistance =
    Math.pow(circleDistanceX - rectangle.width / 2, 2) +
    Math.pow(circleDistanceY - rectangle.height / 2, 2);

  const cornerDistanceAreaIsSmallerThanCircleArea = cornerDistance <= Math.pow(circle.r, 2);
  const circleRadiusAndVirtualRectangleRadiusRelation = circle.r / Math.max(rectangle.x / 2, rectangle.x / 2) >= 1;

  return (cornerDistanceAreaIsSmallerThanCircleArea && circleRadiusAndVirtualRectangleRadiusRelation);
}

type ChildProps = { [key: string]: any };

function isReactTestInstance(
  child: ReactTestInstance | string
): child is ReactTestInstance {
  return typeof child !== "string";
}

export function findPropsOnTestInstance(
  reactTestInstance: ReactTestInstance,
  componentName: string,
  depthSearch: number = 20
): ChildProps {
  const findInside = (
    testInstanceChildren: ReactTestInstance,
    depth: number = depthSearch
  ): any => {
    if (!isReactTestInstance(testInstanceChildren) || depth <= 0) {
      return [Object()];
    }

    if (testInstanceChildren.type === componentName) {
      return testInstanceChildren.props;
    }

    const child: Array<ReactTestInstance | string> =
      testInstanceChildren.children;

    return Array.isArray(child)
      ? child.map((nestedChild: ReactTestInstance | string) =>
          isReactTestInstance(nestedChild)
            ? findInside(nestedChild, depth - 1)
            : Object()
        )
      : findInside(child);
  };

  return findInside(reactTestInstance, depthSearch).flat(Infinity)[0];
}
