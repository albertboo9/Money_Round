
// eslint-disable-next-line react/prop-types
const CustomAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.alertBox}>
        <p>{message}</p>
        <button onClick={onClose} style={styles.button}>OK</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    marginTop: "10px",
    padding: "8px 16px",
    border: "none",
    backgroundColor: "#00FF4CFF",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default CustomAlert;