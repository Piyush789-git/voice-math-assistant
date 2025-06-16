import styles from "./Display.module.css";

const Display = ({ display, result }) => {
    return (
        <div className={styles.display}>
            <div className={styles.expression}>{display}</div>
            <div className={styles.result}>{result}</div>
        </div>
    );
};

export default Display;