import { Prop } from "../types";
import Implicit from "./Implicit";

const TableOfElementElement: React.FunctionComponent<{
  tag: string;
  condSelector?: string[];
  deprecated: 0 | 1;
  implicitRole: string | 0;
  props: readonly Prop[];
  ariaUrl: string | null;
  ariaInHtmlUrl: string;
  loopId: string;
}> = ({
  tag,
  condSelector,
  deprecated,
  implicitRole,
  props,
  ariaUrl,
  ariaInHtmlUrl,
  loopId,
}) => {
  return (
    <tr>
      <th>
        {condSelector ? (
          <ul>
            {condSelector.map((s, si) => (
              <li key={`main-table-row-el${loopId}-selector${si}`}>
                <a href={ariaInHtmlUrl} target="_blank" rel="noreferrer">
                  <code>
                    {/>/.test(s) ? (
                      <i>{s}</i>
                    ) : (
                      <>
                        <span>{tag}</span>
                        <i>{s}</i>
                      </>
                    )}
                  </code>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <a href={ariaInHtmlUrl} target="_blank" rel="noreferrer">
            <code>{tag}</code>
          </a>
        )}
        {deprecated ? <em className="deprecated">Deprecated</em> : null}
      </th>
      <td>
        {implicitRole && ariaUrl ? (
          <a href={ariaUrl} target="_blank" rel="noreferrer">
            <code>{implicitRole}</code>
          </a>
        ) : (
          <>N/A</>
        )}
      </td>
      {props.map((prop, j) => {
        const key = `main-table-row-el${loopId}-aria${j}`;
        switch (prop[0]) {
          case 0: {
            return (
              <td key={key} className="✘">
                No <code>aria-*</code>
              </td>
            );
          }
          case 1: {
            return (
              <td key={key} className="✘">
                No global <code>aria-*</code>
              </td>
            );
          }
          case 2: {
            return (
              <td key={key} className="⚠">
                Deprecated
              </td>
            );
          }
          case 3: {
            return <Implicit key={key} label={prop[1] || "N/A"} />;
          }
          case 4: {
            return (
              <td key={key} className="✘">
                Role has not
              </td>
            );
          }
          case 5: {
            return (
              <td key={key} className="⚠">
                <strong>NOT RECOMMENDED</strong>
              </td>
            );
          }
          case 6: {
            return (
              <td key={key} className="⚠">
                <strong>SHOULD NOT</strong>
              </td>
            );
          }
          case 7: {
            return (
              <td key={key} className="✘">
                <strong>MUST NOT</strong>
              </td>
            );
          }
          case 8: {
            return (
              <td key={key} className="✔">
                Allowed Only
              </td>
            );
          }
          case 9: {
            return (
              <td key={key} className="✔">
                As Global
              </td>
            );
          }
          case 10: {
            return (
              <td key={key} className="✔">
                By Implicit Role
              </td>
            );
          }
          case 11: {
            return (
              <td key={key} className="✔">
                By the <code>{prop[1]}</code> role
              </td>
            );
          }
          case 12: {
            return (
              <td key={key} className="✔">
                <strong>REQUIRED</strong> (By the <code>{prop[1]}</code> role)
              </td>
            );
          }
          default: {
            return (
              <td key={key}>
                <span>
                  {prop[0]}: {prop[1] || "N/A"}
                </span>
              </td>
            );
          }
        }
      })}
    </tr>
  );
};

export default TableOfElementElement;
