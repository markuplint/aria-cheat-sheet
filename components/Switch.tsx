import React, { useCallback } from "react";

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

export default React.memo(Switch);
