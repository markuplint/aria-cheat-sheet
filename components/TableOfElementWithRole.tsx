import { Role } from "../types";
import Implicit from "./Implicit";

const TableOfElementWithRole: React.FunctionComponent<{
  tag: string;
  condSelector?: string[];
  deprecated: 0 | 1;
  roles: readonly Role[];
  ariaInHtmlUrl: string;
  loopId: string;
}> = ({ tag, condSelector, deprecated, roles, ariaInHtmlUrl, loopId }) => {
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
      {roles.map(([allowed], j) => {
        const key = `main-table-row-el${loopId}-aria${j}`;
        return (
          <td key={key} className={allowed ? "✔" : "✘"}>
            <span aria-hidden="true">{allowed ? "✔" : "✘"}</span>
            <span className="visually-hidden">
              {allowed ? "Allowed" : "Disallowd"}
            </span>
          </td>
        );
      })}
    </tr>
  );
};

export default TableOfElementWithRole;
