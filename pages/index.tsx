import type { NextPage } from "next";
import Head from "next/head";

import type { ARIAVersion } from "@markuplint/ml-spec";

import styles from "../styles/Home.module.css";
import { useState } from "react";
import { Data } from "../types";
import TableOfElements from "../components/TableOfElements";
import { extract } from "../utils/extact";
import TableOfElementsWithPermittedRoles from "../components/TableOfElementsWithPermittedRoles";

const versions = {
  "1.2": 0,
  "1.1": 1,
} as const;

const Home: NextPage<{ data: Data }> = ({ data }) => {
  const [version, switchVersion] = useState<ARIAVersion>("1.2");
  const mlVersion = data[0];
  const elements = data[1];
  const roleWithProp = data[2];

  const propList = roleWithProp[versions[version]][0];
  const roleList = roleWithProp[versions[version]][1];

  return (
    <div>
      <Head>
        <title>WAI-ARIA Cheat Sheet</title>
        <meta
          name="description"
          content="WAI-ARIA role and aria-* attribute cheat sheet powered by markuplit"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og.png" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <div
        style={{ position: "sticky", top: 0, background: "white", zIndex: 100 }}
      >
        <header>
          <h1>WAI-ARIA Cheat Sheet ver.β</h1>
          <label>
            <span style={{ marginRight: "1em" }}>ARIA Version</span>
            <span aria-hidden="true">1.1</span>
            <input
              style={{ width: "3em" }}
              type="range"
              min="1.1"
              max="1.2"
              value={version}
              step="0.1"
              onChange={(e) => {
                switchVersion(e.target.value as ARIAVersion);
              }}
            />
            <span aria-hidden="true">1.2</span>
          </label>
        </header>
      </div>

      <main>
        <section>
          <h2 id="el-aria">
            <a href="#el-aria">Elements / ARIA props and states</a>
          </h2>

          <TableOfElements data={elements} version={version} />
        </section>

        <section>
          <h2 id="role-aria">
            <a href="#role-aria">Roles / ARIA props and states</a>
          </h2>

          <div className="table" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  {propList.map(([propName], i) => (
                    <th key={`main-table-thead-aria${propName}`}>
                      <code>{propName}</code>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roleList.map((role, i) => {
                  return (
                    <tr key={`main-table-row-el${i}`}>
                      <th>
                        <a
                          href={`https://www.w3.org/TR/wai-aria-${version}/#${role[0]}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <code>{role[0]}</code>
                        </a>
                        {role[1] ? <em>Abstract</em> : null}
                      </th>
                      {role[2].map(([allowed], j) => {
                        const key = `main-table-row-el${i}-aria${j}`;
                        return (
                          <td key={key} className={allowed ? "✔" : "✘"}>
                            <span aria-hidden="true">
                              {allowed ? "✔" : "✘"}
                            </span>
                            <span className="visually-hidden">
                              {allowed ? "Allowed" : "Disallowd"}
                            </span>
                          </td>
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
          <h2 id="el-role">
            <a href="#el-role">Elements / Roles</a>
          </h2>

          <TableOfElementsWithPermittedRoles
            data={elements}
            version={version}
          />
        </section>
      </main>

      <footer>
        <p>
          Powered by <a href="https://markuplint.dev">markuplint</a> (Ver.{" "}
          {mlVersion})
        </p>
        <p>
          These sheets according to WAI-ARIA 1.1-1.2, Graphics ARIA, ARIA in
          HTML, and each AAM.
        </p>
      </footer>
    </div>
  );
};

export async function getStaticProps(): Promise<{
  props: { data: Data };
}> {
  const data: Data = extract();
  return {
    props: { data },
  };
}

export default Home;
