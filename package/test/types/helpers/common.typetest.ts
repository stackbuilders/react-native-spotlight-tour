import { expectTypeOf } from "expect-type";

import { OmitR } from "../../../src/helpers/common";

interface Foo {
  x: boolean;
  y: number;
  z: string;
}

expectTypeOf<OmitR<Foo, "y" | "z">>().toEqualTypeOf<{ x: boolean; }>();
// @ts-expect-error
expectTypeOf<OmitR<Foo, "a">>().not.toEqualTypeOf<Foo>();
