import { describe, expectTypeOf, it, suite } from "vitest";

import type { OmitR } from "../../src/helpers/common";

interface Foo {
  x: boolean;
  y: number;
  z: string;
}

suite("[Unit] common.test.ts", () => {
  describe("OmitR", () => {
    it("omits the specified keys from a struct-like object", () => {
      expectTypeOf<OmitR<Foo, "y" | "z">>().toEqualTypeOf<{ x: boolean; }>();
      expectTypeOf<OmitR<Foo, "x">>().toEqualTypeOf<{ y: number; z: string; }>();
      // @ts-expect-error
      expectTypeOf<OmitR<Foo, "a">>().not.toEqualTypeOf<Foo>();
    });
  });
});
