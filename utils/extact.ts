import specs, { Attribute } from "@markuplint/html-spec";
import {
  ARIAProperty,
  ARIARoleInSchema,
  ARIAVersion,
  ImplicitRole,
  PermittedARIAProperties,
  PermittedRoles,
} from "@markuplint/ml-spec";
import { resolveVersion } from "@markuplint/ml-spec/lib/specs/resolve-version";
import {
  Data,
  Prop,
  Role,
  TableOfElementData,
  TableOfElementPropHeader,
  TableOfElementRow,
  TableOfRoleWithProp,
} from "../types";
import parser from "postcss-selector-parser";

const noUse = {
  "not-recommended": 5,
  "should-not": 6,
  "must-not": 7,
} as const;

export function extract() {
  const version: string = require("@markuplint/html-spec/package.json").version;
  const elements = unique(specs.specs);
  const aria = specs.def["#aria"];

  function getAriaList(version: ARIAVersion) {
    return unique(aria[version].props);
  }

  function getRoleList(version: ARIAVersion) {
    return unique([...aria[version].roles, ...aria[version].graphicsRoles]);
  }

  function getTableOfElementData(version: ARIAVersion): TableOfElementData {
    const ariaList = getAriaList(version);
    const roleList = getRoleList(version);

    const propHeaders: TableOfElementPropHeader = ariaList.map((prop) => [
      prop.name,
      prop.isGlobal ? 1 : 0,
    ]);

    const roleHeaders: TableOfElementPropHeader = roleList.map((prop) => [
      prop.name,
      prop.isAbstract ? 1 : 0,
    ]);

    const elementsWithARIA: TableOfElementRow[] = elements
      .map<TableOfElementRow[]>((el) => {
        const deprecated = el.deprecated || el.obsolete;
        const name = el.name.replace(":", "|");
        const attrs = Object.entries(el.attributes).map(([name, a]) => ({
          ...a,
          name,
        }));
        const { implicitRole, conditions, properties, permittedRoles } =
          resolveVersion(el.aria, version);
        return [
          [
            // el:
            [name, deprecated ? 1 : 0],
            // implicitRole:
            implicitRole || 0,
            // props:
            _props(ariaList, attrs, implicitRole, properties),
            // roles:
            _roles(roleList, permittedRoles),
          ],
          ...Object.entries(conditions || {}).map<TableOfElementRow>(
            ([condSelector, condition]) => {
              return [
                // el:
                [[name, splitSelector(condSelector)], deprecated ? 1 : 0],
                // implicitRole:
                condition.implicitRole || 0,
                // props:
                _props(
                  ariaList,
                  attrs.filter((attr) => {
                    if (!attr.condition) {
                      return true;
                    }
                    const attrConditions = Array.isArray(attr.condition)
                      ? attr.condition
                      : [attr.condition];

                    return attrConditions.includes(condSelector);
                  }),
                  condition.implicitRole ?? false,
                  properties
                ),
                // roles:
                _roles(roleList, condition.permittedRoles),
              ];
            }
          ),
        ];
      })
      .flat();

    function _role(basisRole: string, prop: ARIAProperty) {
      const role = roleList.find((r) => r.name === basisRole);
      if (!role) {
        return;
      }
      const ownedProp = role.ownedProperties?.find(
        (owned) => owned.name === prop.name
      );
      return ownedProp;
    }

    function _props(
      props: ARIAProperty[],
      attrs: Attribute[],
      implicitRole: ImplicitRole,
      properties?: PermittedARIAProperties
    ): Prop[] {
      return props.map<Prop>((prop): Prop => {
        if (properties === false) {
          // According to ARIA in HTML
          return [0, 0];
        }

        if (properties?.whithout) {
          for (const without of properties.whithout) {
            if (without.name === prop.name) {
              return [noUse[without.type], without.alt?.method || "___"];
            }
          }
        }

        if (properties?.only) {
          for (const onlyAllowed of properties.only) {
            let onlyAllowedName: string;
            if (typeof onlyAllowed === "string") {
              onlyAllowedName = onlyAllowed;
            } else {
              onlyAllowedName = onlyAllowed.name;
            }
            if (onlyAllowedName === prop.name) {
              return [8, 0];
            }
          }
        }

        if (prop.isGlobal) {
          if (properties && properties.global !== true) {
            // According to ARIA in HTML
            return [1, 0];
          } else {
            if (implicitRole) {
              const ownedProp = _role(implicitRole, prop);
              if (ownedProp?.deprecated) {
                return [2, implicitRole];
              }
            }
            return [9, 0];
          }
        }

        const implicitAttr = prop.equivalentHtmlAttrs?.find((prop) =>
          attrs.some((htmlAttr) => htmlAttr.name === prop.htmlAttrName)
        );
        if (implicitAttr) {
          // According to the role (WAI-ARIA)
          return [3, implicitAttr.htmlAttrName];
        }

        const basisRoles: string[] = [];

        if (properties?.role) {
          if (properties.role === true) {
            if (implicitRole) {
              basisRoles.push(implicitRole);
            }
          } else if (Array.isArray(properties.role)) {
            basisRoles.push(...properties.role);
          } else {
            basisRoles.push(properties.role);
          }
        } else {
          if (implicitRole) {
            basisRoles.push(implicitRole);
          }
        }

        if (basisRoles.length === 0) {
          // No Role and No Global Prop
          return [4, 0];
        }
        for (const basisRole of basisRoles) {
          const role = roleList.find((r) => r.name === basisRole);
          if (!role) {
            continue;
          }
          const ownedProp = _role(role.name, prop);
          if (!ownedProp) {
            continue;
          }
          // According to the role (WAI-ARIA)
          if (ownedProp.deprecated) {
            return [2, role.name];
          }
          if (ownedProp.required) {
            return [12, role.name];
          }
          if (implicitRole === role.name) {
            return [10, 0];
          }
          return [11, role.name];
        }

        return [4, 0];
      });
    }

    function _roles(
      roleList: ARIARoleInSchema[],
      permittedRoles?: PermittedRoles
    ): Role[] {
      return roleList.map((role) => {
        if (permittedRoles === undefined) {
          return [0];
        }

        if (typeof permittedRoles === "boolean") {
          if (permittedRoles) {
            return [1];
          }
          return [0];
        }

        if (Array.isArray(permittedRoles)) {
          for (const permitted of permittedRoles) {
            if (typeof permitted === "string") {
              if (permitted === role.name) {
                return [1];
              }
              return [0];
            }
            if (permitted.name === role.name) {
              return [1];
            }
            return [0];
          }

          // Array is empty
          return [0];
        }

        if (role.name.indexOf("graphics-") === 0) {
          if (permittedRoles["graphics-aam"] === true) {
            return [1];
          }
          return [0];
        } else if (permittedRoles["core-aam"] === true) {
          return [1];
        }

        return [0];
      });
    }

    return [propHeaders, roleHeaders, elementsWithARIA];
  }

  function getTableOfRoleWithProp(version: ARIAVersion): TableOfRoleWithProp {
    const props = getAriaList(version);
    const roleList = getRoleList(version);

    return [
      // Props
      props.map((p) => [p.name]),
      // Roles
      roleList.map((r) => [
        // name
        r.name,
        // isAbstract
        r.isAbstract ? 1 : 0,
        //
        props.map((prop) => {
          const owned = r.ownedProperties?.find((o) => o.name === prop.name);
          if (!owned) {
            return [0];
          }
          return [
            // Status
            1,
          ];
        }),
      ]),
    ];
  }

  const data: Data = [
    version,
    [getTableOfElementData("1.2"), getTableOfElementData("1.1")],
    [getTableOfRoleWithProp("1.2"), getTableOfRoleWithProp("1.1")],
  ];

  return data;
}

function splitSelector(selector: string): string[] {
  const selectors: parser.Selector[] = [];
  parser((root) => {
    selectors.push(...root.nodes);
  }).processSync(selector);
  return selectors.map((s) => s.toString().trim());
}

function unique<T extends { name: string }>(array: T[]): T[] {
  const names = new Set<string>();
  return array.filter((item) => {
    if (names.has(item.name)) {
      return false;
    }
    names.add(item.name);
    return true;
  });
}
