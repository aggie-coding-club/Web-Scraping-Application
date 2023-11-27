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
    </div>
  );
};

export default ContactPage;
