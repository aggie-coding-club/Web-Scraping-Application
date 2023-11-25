import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="d-flex flex-row justify-content-start gap-5">
      <a className="fs-4" href="/">
        Web Scraping Application
      </a>
      <a href="/about">About</a>
      <a href="/contact">Contact Us</a>
    </div>
  );
};

export default Footer;
