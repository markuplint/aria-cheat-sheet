import React from "react";

import { Aria, RoleList } from "../types";
import Allowed from "./Allowed";
import Disallowed from "./Disallowed";

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

export default React.memo(AriaAllowness);
