import type spec from "@markuplint/html-spec";

export type Data = {
  ariaList: AriaList;
  roleList: RoleList;
  elements: typeof spec.specs;
  version: string;
};

export type RoleList = typeof spec.def["#roles"];
export type AriaList = typeof spec.def["#ariaAttrs"];
export type Aria = AriaList[0];
