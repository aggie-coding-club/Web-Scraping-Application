import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="mt-5 py-4" style={{ backgroundColor: "#ddf2fd" }}>
      <div className="d-flex flex-row justify-content-center gap-5">
        <a className="fs-4" href="/">
          Web Scraping Application
        </a>
        <a className="m-2" href="/about">
          About
        </a>
        <a className="m-2" href="/contact">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export { Footer };
