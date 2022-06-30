import type specs from "@markuplint/html-spec";

export type Specs = {
  elements: typeof specs["specs"];
  aria: typeof specs["def"]["#aria"];
  mlVersion: string;
};

export type Elements = typeof specs["specs"];
export type RoleList = typeof specs.def["#aria"]["1.2"]["roles"];
export type AriaList = typeof specs.def["#aria"]["1.2"]["props"];
export type Aria = AriaList[0];

export type Data = [
  version: string,
  tableOfElement: readonly TableOfElementData[],
  tableOfRoleWithProp: readonly TableOfRoleWithProp[]
];
export type TableOfElementData = readonly [
  TableOfElementPropHeader,
  TableOfElementRoleHeader,
  readonly TableOfElementRow[]
];
export type TableOfElementPropHeader = readonly [
  ...props: [name: string, global: 1 | 0][]
];
export type TableOfElementRoleHeader = readonly [
  ...props: [name: string, isAbstract: 1 | 0][]
];
export type TableOfElementRow = [
  el: [
    name: string | [name: string, attrSelector: string[]],
    deprecated: 0 | 1
  ],
  implicitRole: string | 0,
  props: readonly Prop[],
  roles: readonly Role[]
];
export type Prop = [
  type:
    | 0 // No use aria-* attribute
    | 1 // No use global aria-* attribute
    | 2 // Deprecated
    | 3 // Implicit prop
    | 4 // Has no role
    | 5 // "not-recommended"
    | 6 // "should-not"
    | 7 // "must-not"
    | 8 // 100 // Allowed only
    | 9 // 101 // Allowed global aria-* attribute
    | 10 // 102 // From implicit role
    | 11 // 103 // From the role
    | 12 // 104 // Required from the role
    // for debug
    | `__${string}`,
  alt: string | 0
];
export type Role = [type: 0 | 1];

export type TableOfRoleWithProp = [
  // Props
  props: [name: string][],
  // Roles
  roles: [
    // name
    name: string,
    // isAbstract
    isAbstract: 0 | 1,
    // Owned Props
    ownedProps: [
      // Status
      status: 0 | 1
    ][]
  ][]
];
