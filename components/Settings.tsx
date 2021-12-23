import React, { useCallback, useEffect, useRef, useState } from "react";

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

export default React.memo(Settings);
