import type { NextPage } from "next";
import Head from "next/head";

import spec from "@markuplint/html-spec";
import type { PermittedRoles } from "@markuplint/ml-spec";

import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { Data } from "../types";
import AriaAllowness from "../components/AriaAllowness";
import Settings from "../components/Settings";
import Switch from "../components/Switch";
import Allowed from "../components/Allowed";
import Disallowed from "../components/Disallowed";
import Implicit from "../components/Implicit";

const Home: NextPage<Data> = ({ ariaList, roleList, elements }) => {
  const [showedDeprecated, showDeprecated] = useState(false);

  const unAbsRoleList = roleList.filter((role) => !role.isAbstract);

  return (
    <div>
      <Head>
        <title>WAI-ARIA Cheat Sheet</title>
        <meta
          name="description"
          content="WAI-ARIA role and aria-* attribute cheat sheet powered by markuplit"
        />
        <link rel="icon" href="/icon.png" />
      </Head>

      <header className={styles.header}>
        <h1>WAI-ARIA Cheat Sheet ver.β</h1>
        <Settings id="settings">
          <Switch
            label="Show deprecated elements"
            defaultValue={showedDeprecated}
            onChange={showDeprecated}
          />
        </Settings>
      </header>

      <main>
        <section>
          <h2>Elements / ARIA props and states</h2>

          <div className={styles.tableContainer} tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Element</th>
                  <th scope="col">Implicit Role</th>
                  {ariaList.map((aria, i) => (
                    <th key={`main-table-thead-aria${i}`} scope="col">
                      <code>{aria.name}</code>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {elements.map((el, i) => {
                  const deprecated = el.deprecated || el.obsolete;

                  if (!showedDeprecated && deprecated) {
                    return null;
                  }

                  const name = el.name.replace(":", "|");

                  return (
                    <React.Fragment key={`main-table-row-el${i}`}>
                      <tr>
                        <th scope="row">
                          <code>{name}</code>
                          {deprecated && (
                            <em className="deprecated">Deprecated</em>
                          )}
                        </th>
                        <td>
                          {el.implicitRole.role ? (
                            <a
                              href={`https://www.w3.org/TR/wai-aria-1.2/#${el.implicitRole.role}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <code>{el.implicitRole.role}</code>
                            </a>
                          ) : (
                            <>N/A</>
                          )}
                        </td>
                        {ariaList.map((aria, j) => {
                          const key = `main-table-row-el${i}-aria${j}`;
                          return (
                            <AriaAllowness
                              key={key}
                              aria={aria}
                              roleName={el.implicitRole.role}
                              roleList={roleList}
                            />
                          );
                        })}
                      </tr>
                      {el.implicitRole.conditions &&
                        el.implicitRole.conditions.map((cond, j) => {
                          const name = el.name.replace(":", "|");

                          return (
                            <tr key={`main-table-row-el${i}-cond${j}`}>
                              <th scope="row">
                                <code>
                                  {name}
                                  {cond.condition}
                                </code>
                              </th>
                              <td>
                                {cond.role ? (
                                  <a
                                    href={`https://www.w3.org/TR/wai-aria-1.2/#${cond.role}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <code>{cond.role}</code>
                                  </a>
                                ) : (
                                  <>N/A</>
                                )}
                              </td>
                              {ariaList.map((aria, k) => {
                                const key = `main-table-row-el${i}-cond${j}-aria${k}`;
                                return (
                                  <AriaAllowness
                                    key={key}
                                    aria={aria}
                                    roleName={cond.role}
                                    roleList={roleList}
                                  />
                                );
                              })}
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Roles / ARIA props and states</h2>

          <div className={styles.tableContainer} tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Role</th>
                  {ariaList.map((aria, i) => (
                    <th key={`main-table-thead-aria${i}`} scope="col">
                      <code>{aria.name}</code>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roleList.map((role, i) => {
                  return (
                    <tr key={`main-table-row-el${i}`}>
                      <th scope="row">
                        <a
                          href={`https://www.w3.org/TR/wai-aria-1.2/#${role.name}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <code>{role.name}</code>
                        </a>
                        {role.isAbstract && <em>Abstract</em>}
                      </th>
                      {ariaList.map((aria, j) => {
                        const key = `main-table-row-el${i}-aria${j}`;
                        return (
                          <AriaAllowness
                            key={key}
                            aria={aria}
                            roleName={role.name}
                            roleList={roleList}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Elements / Roles</h2>

          <div className={styles.tableContainer} tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Element</th>
                  {unAbsRoleList.map((role, i) => (
                    <th key={`main-table-thead-role${i}`} scope="col">
                      <code>{role.name}</code>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {elements.map((el, i) => {
                  const deprecated = el.deprecated || el.obsolete;

                  if (!showedDeprecated && deprecated) {
                    return null;
                  }

                  const name = el.name.replace(":", "|");
                  const isSVG = name.indexOf("svg|") === 0;

                  return (
                    <React.Fragment key={`main-table-row-el${i}`}>
                      <tr>
                        <th scope="row">
                          <code>{name}</code>
                          {deprecated && (
                            <em className="deprecated">Deprecated</em>
                          )}
                        </th>
                        {unAbsRoleList.map((role, j) => {
                          const key = `main-table-row-el${i}-role${j}`;
                          if (isSVG) {
                            return <Allowed key={key} />;
                          }
                          if (el.implicitRole.role === role.name) {
                            return <Implicit key={key} />;
                          }
                          return isPermittedRole(
                            role.name,
                            el.permittedRoles.roles
                          ) ? (
                            <Allowed key={key} />
                          ) : (
                            <Disallowed key={key} />
                          );
                        })}
                      </tr>
                      {el.permittedRoles.conditions &&
                        el.permittedRoles.conditions.map((cond, j) => {
                          const name = el.name.replace(":", "|");

                          return (
                            <tr key={`main-table-row-el${i}-cond${j}`}>
                              <th scope="row">
                                <code>
                                  {name}
                                  {cond.condition}
                                </code>
                              </th>
                              {unAbsRoleList.map((role, k) => {
                                const key = `main-table-row-el${i}-cond${j}-aria${k}`;
                                return isPermittedRole(
                                  role.name,
                                  cond.roles
                                ) ? (
                                  <Allowed key={key} />
                                ) : (
                                  <Disallowed key={key} />
                                );
                              })}
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>
        <p>
          Powered by <a href="https://markuplint.dev">markuplint</a>
        </p>
        <p>The spec according to WAI-ARIA 1.2 and ARIA in HTML</p>
      </footer>
    </div>
  );
};

export async function getStaticProps(): Promise<{ props: Data }> {
  return {
    props: {
      elements: spec.specs,
      ariaList: spec.def["#ariaAttrs"],
      roleList: spec.def["#roles"],
    },
  };
}

export default Home;

function isPermittedRole(name: string, roles: PermittedRoles) {
  if (typeof roles === "boolean") {
    return roles;
  }
  return roles.includes(name);
}
