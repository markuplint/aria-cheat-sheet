import styles from "../styles/Implicit.module.css";

const Implicit: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <td className={styles.implicit}>
      <em>Implicit</em>
      {label && (
        <>
          <br />
          <strong>
            Use the &quot;<em>{label}</em>&quot; attr
          </strong>
        </>
      )}
    </td>
  );
};

export default Implicit;
