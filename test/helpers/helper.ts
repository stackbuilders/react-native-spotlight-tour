import { ReactTestInstance } from "react-test-renderer";

interface Props {
  [key: string]: any;
}

function findPropsOnFiberNode(
  fiberNode: any,
  componentType: string,
  depth: number = 1
): Props | null {
  const getProps = (fiberNodeItem: any) => {
    return fiberNode?.stateNode
      ? fiberNode.stateNode?.props
      : fiberNodeItem?.firstEffect?.stateNode?.props;
  };

  if (fiberNode === null || depth <= 0) {
    return null;
  }

  return fiberNode.elementType === componentType
    ? getProps(fiberNode)
    : findPropsOnFiberNode(fiberNode?.firstEffect, componentType, depth - 1);
}

export function getChildrenProp(
  fiberNode: ReactTestInstance,
  componentType: string
): Props {
  let valueFound: Props = {};
  const fiberNodeArray: any = fiberNode?.children;

  if (Array.isArray(fiberNodeArray)) {
    fiberNodeArray.forEach((fiberNodeItem: ReactTestInstance) => {
      const anyFiber: any = fiberNodeItem;
      const props = findPropsOnFiberNode(anyFiber?._fiber, componentType, 2);
      if (props) {
        valueFound = props;
      }
    });
  }

  return valueFound;
}

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

  const rectangleCenter = {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y + rectangle.height / 2
  };

  const distance = Math.sqrt(
    Math.pow(rectangleCenter.y - circle.y, 2) +
      Math.pow(rectangleCenter.x - circle.x, 2)
  );
  if (
    circle.r <= distance &&
    distance >= rectangle.height / 2 + circle.r &&
    distance >= rectangle.width / 2 + circle.r
  ) {
    return false;
  }

  const cornerDistanceSq =
    Math.pow(circleDistanceX - rectangle.width / 2, 2) +
    Math.pow(circleDistanceY - rectangle.height / 2, 2);

  return (
    cornerDistanceSq <= Math.pow(circle.r, 2) &&
    circle.r / Math.max(rectangle.x / 2, rectangle.x / 2) >= 1
  );
}

export const getElementByPath = (object: any, path: string | any[]) => {
  if (typeof path === "string") {
    path = path
      .split(".")
      .filter((key: string) => key.length)
      .map((key: string) =>
        key.replace(/\[|\]/gm, "").replace(/\_/gm, "children")
      );
  }

  return path.reduce((dive: any, key: string) => dive && dive[key], object);
};

type PropsSearch = { [key: string]: any }[];

export function findPropsOnTestInstance(
  obj: ReactTestInstance,
  name: string,
  depthSearch: number = 10
) {
  const findInside = (
    testInstanceChildren: ReactTestInstance,
    depth: number = depthSearch
  ): PropsSearch => {
    if (testInstanceChildren === null) {
      return [];
    }
    const children: any = testInstanceChildren.children;
    const testInstanceType: any = testInstanceChildren.type;

    if (
      children.type?.displayName === name ||
      testInstanceType?.render?.name === name
    ) {
      return [testInstanceChildren.props];
    }

    if (depth <= 0) {
      return [];
    }

    if (Array.isArray(children)) {
      return children
        .map((rt: ReactTestInstance) => findInside(rt, depth - 1))
        .flat(1);
    }

    return findInside(children, depth - 1);
  };

  const propsFound = findInside(obj, depthSearch);
  return Array.isArray(propsFound)
    ? propsFound.flat(Infinity).filter((a: any) => !!a)
    : [propsFound];
}
