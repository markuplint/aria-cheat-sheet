import styles from "../styles/Disallowed.module.css";

const Disallowed: React.FC = () => {
  return (
    <td className={styles.disallowed}>
      <span aria-hidden="true">✘</span>
      <span className="visually-hidden">Disallowed</span>
    </td>
  );
};

export default Disallowed;
