import { useState, useId, useCallback, ChangeEvent, useEffect } from "react";
import { TableOfElementData, TableOfElementRow } from "../types";
import { ARIAVersion } from "@markuplint/ml-spec";
import TableOfElementWithRole from "./TableOfElementWithRole";
import Switch from "./Switch";

function getSlector(name: string | [name: string, attrSelector: string[]]) {
  const [tag, condSelector] = Array.isArray(name) ? name : [name];
  return { tag, condSelector };
}

function count(elements: readonly TableOfElementRow[]) {
  return elements.filter((el) => !Array.isArray(el[0][0])).length;
}

function deprecatedFilter(
  elements: readonly TableOfElementRow[],
  showedDeprecated: boolean
) {
  return elements.filter((el) => {
    const deprecated = el[0][1];
    if (!showedDeprecated && deprecated) {
      return false;
    }
    return true;
  });
}

const versions = {
  "1.2": 0,
  "1.1": 1,
} as const;

const TableOfElementsWithPermittedRoles: React.FunctionComponent<{
  data: readonly TableOfElementData[];
  version: ARIAVersion;
}> = ({ data, version }) => {
  const id = useId();
  const [roleNames, updateRoleNames] = useState(data[versions[version]][1]);
  const [showedDeprecated, showDeprecated] = useState(false);
  const [text, searchText] = useState("");
  const [elements, updateElements] = useState(
    deprecatedFilter(data[versions[version]][2], showedDeprecated)
  );
  const [elementCount, updateElementCount] = useState(count(elements));

  const changeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    searchText(text);
  }, []);

  const onSwitchDeprecated = useCallback((on: boolean) => {
    showDeprecated(on);
  }, []);

  useEffect(() => {
    const newElements = deprecatedFilter(
      data[versions[version]][2],
      showedDeprecated
    ).filter((el) => {
      const { tag, condSelector } = getSlector(el[0][0]);

      if (text) {
        if (
          !(
            tag.includes(text) ||
            condSelector?.some((cond) => cond.includes(text))
          )
        ) {
          return false;
        }
      }
      return true;
    });

    updateRoleNames(data[versions[version]][1]);
    updateElements(newElements);
    updateElementCount(count(newElements));
  }, [data, showedDeprecated, text, version]);

  return (
    <div className="table" tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th>
              <details open>
                <summary>Element</summary>
                <div>
                  <label>
                    <span>Filter</span>
                    <input
                      id={id}
                      type="search"
                      value={text}
                      onChange={changeText}
                    />
                  </label>
                  <output htmlFor={id}>
                    {elementCount} Elements ({elements.length} Patterns)
                  </output>
                </div>
                <div>
                  <Switch
                    label="Show deprecated elements"
                    defaultValue={showedDeprecated}
                    onChange={onSwitchDeprecated}
                  />
                </div>
              </details>
            </th>
            {roleNames.map(([propName, abstract]) => (
              <th key={`main-table-thead-${propName}`}>
                <code>{propName}</code>
                {abstract ? <b>abstract</b> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((el, i) => {
            const deprecated = el[0][1];
            const { tag, condSelector } = getSlector(el[0][0]);
            const loopId = tag + (condSelector?.join() ?? "") + version;
            const roles = el[3];
            const ariaInHtmlUrl =
              tag.indexOf("svg|") === 0
                ? `https://www.w3.org/TR/svg-aam-1.0/#details-id-${i - 186}`
                : `https://w3c.github.io/html-aria/#el-${tag}`;

            return (
              <TableOfElementWithRole
                tag={tag}
                condSelector={condSelector}
                deprecated={deprecated}
                roles={roles}
                ariaInHtmlUrl={ariaInHtmlUrl}
                loopId={loopId}
                key={`main-table-row-el-role-${loopId}`}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableOfElementsWithPermittedRoles;
