import type { NextPage } from "next";
import Head from "next/head";

import spec from "@markuplint/html-spec";

import styles from "../styles/Home.module.css";

type Data = {
  ariaList: typeof spec.def["#ariaAttrs"];
  roleList: typeof spec.def["#roles"];
  elements: typeof spec.specs;
};

const Home: NextPage<Data> = ({ ariaList, roleList, elements }) => {
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

      <header>
        <h1>WAI-ARIA Cheat Sheet ver.β</h1>
      </header>

      <main>
        <div className={styles.tableContainer} tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Element</th>
                <th scope="col">Implicit Role</th>
                {ariaList.map((aria, i) => (
                  <th key={`main-table-thead-aria${i}`} scope="col">
                    {aria.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {elements.map((el, i) => (
                <>
                  <tr key={`main-table-row-el${i}`}>
                    <th scope="row">
                      <code>{el.name}</code>
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
                      const role = roleList.find(
                        (r) => r.name === el.implicitRole.role
                      );
                      if (role) {
                        const allowed = role.ownedAttribute.find(
                          (a) => a.name === aria.name
                        );
                        if (allowed) {
                          return <Allowed key={key} />;
                        } else {
                          return <Disallowed key={key} />;
                        }
                      } else {
                        return <Allowed key={key} />;
                      }
                    })}
                  </tr>
                  {el.implicitRole.conditions &&
                    el.implicitRole.conditions.map((cond, j) => (
                      <tr key={`main-table-row-el${i}-cond${j}`}>
                        <th scope="row">
                          <code>
                            {el.name}
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
                          const role = roleList.find(
                            (r) => r.name === cond.role
                          );
                          if (role) {
                            const allowed = role.ownedAttribute.find(
                              (a) => a.name === aria.name
                            );
                            if (allowed) {
                              return <Allowed key={key} />;
                            } else {
                              return <Disallowed key={key} />;
                            }
                          } else {
                            return <Allowed key={key} />;
                          }
                        })}
                      </tr>
                    ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
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

const Allowed: React.FC = () => {
  return (
    <td className={styles.allowed}>
      <span aria-hidden="true">✔</span>
      <span className="visually-hidden">Allowed</span>
    </td>
  );
};

const Disallowed: React.FC = () => {
  return (
    <td className={styles.disallowed}>
      <span aria-hidden="true">✘</span>
      <span className="visually-hidden">Disallowed</span>
    </td>
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
