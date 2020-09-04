import React from "react";

type NativeMethodsObj  = {
  [key: string]: (...args: any) => any | jest.Mock;
};

const mockNativeComponent = (modulePath: string, mockMethods: NativeMethodsObj) => {
  const RealComponent = jest.requireActual(modulePath);

  const SuperClass =
    typeof RealComponent === "function" ? RealComponent : React.Component;

  const Component = class extends SuperClass {
    static displayName = "Component";

    render() {
      const name =
        RealComponent.displayName ||
        RealComponent.name ||
        (RealComponent.render // handle React.forwardRef
          ? RealComponent.render.displayName || RealComponent.render.name
          : "Unknown");

      const props = Object.assign({}, RealComponent.defaultProps);

      if (this.props) {
        Object.keys(this.props).forEach(prop => {
          if (this.props[prop] !== undefined) {
            props[prop] = this.props[prop];
          }
        });
      }

      return React.createElement(
        name.replace(/^(RCT|RK)/, ""),
        props,
        this.props.children
      );
    }
  };

  Object.keys(RealComponent).forEach(classStatic => {
    Component[classStatic] = RealComponent[classStatic];
  });

  Object.assign(Component.prototype, mockMethods);

  return Component;

};

export default mockNativeComponent;
