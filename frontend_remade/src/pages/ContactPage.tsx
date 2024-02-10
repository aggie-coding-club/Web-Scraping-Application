const ContactPage = () => {
  return (
    <div className="p-5">
      <h1>Contact Us</h1>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Questions
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"></textarea>
      </div>
      <button
        type="button"
        className="btn btn-primary"
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
        }}>
        Submit
      </button>
    </div>
  );
};

export default ContactPage;
