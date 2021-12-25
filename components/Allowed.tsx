import styles from "../styles/Allowed.module.css";

const Allowed: React.FC = () => {
  return (
    <td className={styles.allowed}>
      <span aria-hidden="true">✔</span>
      <span className="visually-hidden">Allowed</span>
    </td>
  );
};

export default Allowed;
