import { useState, useId, useCallback, ChangeEvent, useEffect } from "react";
import { TableOfElementData, TableOfElementRow } from "../types";
import { ARIAVersion } from "@markuplint/ml-spec";
import TableOfElementElement from "./TableOfElementElement";
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

const TableOfElements: React.FunctionComponent<{
  data: readonly TableOfElementData[];
  version: ARIAVersion;
}> = ({ data, version }) => {
  const id = useId();
  const [propNames, updatePropNames] = useState(data[versions[version]][0]);
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

    updatePropNames(data[versions[version]][0]);
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
            <th>Implicit Role</th>
            {propNames.map(([propName, global]) => (
              <th key={`main-table-thead-${propName}`}>
                <code>{propName}</code>
                {global ? <b>global</b> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((el, i) => {
            const deprecated = el[0][1];
            const { tag, condSelector } = getSlector(el[0][0]);
            const loopId = tag + (condSelector?.join() ?? "") + version;
            const implicitRole = el[1];
            const props = el[2];
            const ariaInHtmlUrl =
              tag.indexOf("svg|") === 0
                ? `https://www.w3.org/TR/svg-aam-1.0/#details-id-${i - 186}`
                : `https://w3c.github.io/html-aria/#el-${tag}`;
            const ariaUrl =
              (implicitRole &&
                (implicitRole.indexOf("graphics-") === 0
                  ? `https://w3c.github.io/graphics-aria/#${implicitRole}`
                  : `https://www.w3.org/TR/wai-aria-${version}/#${implicitRole}`)) ||
              null;

            return (
              <TableOfElementElement
                tag={tag}
                condSelector={condSelector}
                deprecated={deprecated}
                props={props}
                implicitRole={implicitRole}
                ariaInHtmlUrl={ariaInHtmlUrl}
                ariaUrl={ariaUrl}
                loopId={loopId}
                key={`main-table-row-el${loopId}`}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableOfElements;
