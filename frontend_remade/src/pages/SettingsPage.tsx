const SettingsPage = () => {
  return (
    <div className="p-5">
      <h1>Settings</h1>
      <button
        type="button"
        className="btn btn-secondary mt-5"
        data-bs-toggle="button"
        style={{
          backgroundColor: "#164863",
          transition: "background-color 0.3s",
          borderColor: "#427d9d",
          borderWidth: "1px",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.backgroundColor = "#9bbec8";
          e.currentTarget.style.borderColor = "#9bbec8";
          e.currentTarget.style.borderWidth = "2px";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.backgroundColor = "#427d9d";
          e.currentTarget.style.borderWidth = "1px";
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#427d9d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#164863";
          e.currentTarget.style.borderWidth = "1px";
        }}
      >
        Dark Mode
      </button>
    </div>
  );
};

export { SettingsPage };
