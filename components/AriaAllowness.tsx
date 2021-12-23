import React from "react";

import styles from "../styles/AriaAllowness.module.css";
import { Aria, RoleList } from "../types";

const AriaAllowness: React.FC<{
  aria: Aria;
  roleName: string | false;
  roleList: RoleList;
}> = ({ aria, roleName, roleList }) => {
  const role = roleList.find((r) => r.name === roleName);
  if (role) {
    const allowed = role.ownedAttribute.find((a) => a.name === aria.name);
    if (allowed) {
      return <Allowed />;
    } else {
      return <Disallowed />;
    }
  } else {
    return <Allowed />;
  }
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

export default React.memo(AriaAllowness);
