import type { NextPage } from "next";
import Head from "next/head";

import spec from "@markuplint/html-spec";

import styles from "../styles/Home.module.css";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Data = {
  ariaList: typeof spec.def["#ariaAttrs"];
  roleList: typeof spec.def["#roles"];
  elements: typeof spec.specs;
};

const Home: NextPage<Data> = ({ ariaList, roleList, elements }) => {
  const [showedDeprecated, showDeprecated] = useState(false);

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
        <Settings id="settings">
          <Switch
            label="Show deprecated elements"
            defaultValue={showedDeprecated}
            onChange={showDeprecated}
          />
        </Settings>
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
              {elements.map((el, i) => {
                const deprecated = el.deprecated || el.obsolete;

                if (!showedDeprecated && deprecated) {
                  return null;
                }

                const role = roleList.find(
                  (r) => r.name === el.implicitRole.role
                );

                return (
                  <>
                    <tr key={`main-table-row-el${i}`}>
                      <th scope="row">
                        <code>{el.name}</code>
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
                );
              })}
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

const Settings: React.FC<React.PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const [opened, open] = useState(false);
  const $dialog = useRef<HTMLElement>(null);

  useEffect(() => {
    function close() {
      open(false);
    }

    if ($dialog.current) {
      // @ts-ignore
      if (opened && !$dialog.current.open) {
        // @ts-ignore
        $dialog.current.showModal();
      }

      $dialog.current.addEventListener("close", close);
    }

    return () => {
      $dialog.current?.addEventListener("close", close);
    };
  }, [opened, $dialog]);

  const onClick = useCallback(() => {
    open(!opened);
  }, [opened]);

  const headingId = `${id}__heading`;

  return (
    <>
      <button type="button" onClick={onClick}>
        <span aria-hidden="true">⚙</span>
        <span className="visually-hidden">Settings</span>
      </button>
      <dialog id={id} ref={$dialog} aria-labelledby={headingId}>
        <h1 id={headingId}>Settings</h1>
        {children}
      </dialog>
    </>
  );
};

const Switch: React.FC<{
  label: string;
  onChange: (value: boolean) => void;
  defaultValue?: boolean;
}> = ({ label, onChange, defaultValue }) => {
  const onChangeRaw = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.checked);
    },
    [onChange]
  );
  return (
    <>
      <label>
        <input type="checkbox" onChange={onChangeRaw} checked={defaultValue} />
        <span>{label}</span>
      </label>
    </>
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
