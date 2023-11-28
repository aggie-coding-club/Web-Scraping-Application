import { useEffect } from "react";
import { Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { MdCodeOff } from "react-icons/md";
import { FaCheck, FaShieldAlt } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TiCloudStorageOutline } from "react-icons/ti";
import { LuClock4 } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import "../styles/Home.css";
import HomeTable from "../assets/Table.png";

import AmazonLogo from "../assets/amazon-logo.png";
import GoogleLogo from "../assets/google-logo.png";
import eBayLogo from "../assets/ebay-logo.png";
import MicrosoftLogo from "../assets/microsoft-logo.png";
import UberLogo from "../assets/uber-logo.png";
import SpotifyLogo from "../assets/spotify-logo.png";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <div className="home-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: {
            enable: false,
            zIndex: 0,
          },
          particles: {
            number: {
              value: 100,
              limit: 300,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "polygon",
              stroke: {
                width: 0,
                color: "#ffffff",
              },
              polygon: {
                nb_sides: 6,
              },
              image: {
                src: "images/github.svg",
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.5,
                sync: false,
              },
            },
            size: {
              value: { min: 0, max: 30 },
              random: true,
              anim: {
                enable: true,
                speed: 10,
                size_min: 10,
                sync: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 100,
              color: "#ffffff",
              opacity: 1,
              width: 1,
            },
            move: {
              enable: true,
              speed: { min: 1, max: 3 },
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: {
                  enable: false,
                  force: 60,
                  smooth: 10,
                },
              },
              onClick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                lineLinked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 50,
                size: 100,
                duration: 2,
                opacity: 1,
                speed: 2,
              },
              repulse: {
                distance: 200,
              },
              push: {
                particles_nb: 1,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          backgroundMask: {
            enable: true,
            cover: {
              color: {
                value: {
                  r: 246,
                  g: 249,
                  b: 252,
                },
              },
              opacity: 1,
            },
          },
          retina_detect: true,
          fps_limit: 60,
          background: {
            image:
              "url('https://static.vecteezy.com/system/resources/thumbnails/008/167/404/small/simply-soft-gradation-technology-background-free-vector.jpg')",
          },
        }}
      />

      {/* Hero Section */}
      <div className="flex">
        <div className="hero-section opacity-1 d-flex" data-aos="fade-up">
          <div className="text-content">
            <h1 className="hero-title">
              <span className="highlight">Empower</span> your data collection
            </h1>
            <p className="hero-subtitle">
              Transform your web data gathering effortlessly. Monitor websites
              for real-time updates and stay ahead.
            </p>
            <Button
              href="/#"
              className="hero-cta"
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
              Get Started
            </Button>
          </div>
          <div className="home-image ms-auto">
            <img src={HomeTable} alt="Image" />
          </div>
        </div>
      </div>

      {/* Company Logos Section */}
      <div
        className="company-logos-section"
        data-aos="fade-up"
        data-aos-delay="100">
        <h3>
          Web Scraping is an important tool utilized by the following companies
          and more:
        </h3>
        <div className="company-logos">
          {/* Row 1 */}
          <div className="logo-item">
            <img src={SpotifyLogo} alt="Spotify" className="company-logo" />
          </div>
          <div className="logo-item">
            <img src={AmazonLogo} alt="Amazon" className="company-logo" />
          </div>
          <div className="logo-item">
            <img src={GoogleLogo} alt="Google" className="company-logo" />
          </div>
          <div className="logo-item">
            <img src={eBayLogo} alt="eBay" className="company-logo" />
          </div>
          <div className="logo-item">
            <img src={MicrosoftLogo} alt="Microsoft" className="company-logo" />
          </div>
          <div className="logo-item">
            <img src={UberLogo} alt="Uber" className="company-logo" />
          </div>
        </div>
      </div>
      {/* Feature Highlights */}
      <div className="feature-section" data-aos="fade-up" data-aos-delay="100">
        <div
          className="d-flex flex-column justify-content-center align-items-center feature"
          data-aos="fade-right"
          data-aos-delay="200">
          <MdCodeOff className="feature-icon" />
          <h3 className="feature-title">No Code Required</h3>
          <p className="feature-description">
            Collect valuable data without any coding skills.
          </p>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-center feature"
          data-aos="fade-right"
          data-aos-delay="300">
          <FaCheck className="feature-icon" />
          <h3 className="feature-title">Easy to Use</h3>
          <p className="feature-description">
            User-friendly interface for seamless data collection.
          </p>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-center feature"
          data-aos="fade-right"
          data-aos-delay="400">
          <BsLightningFill className="feature-icon" />
          <h3 className="feature-title">Lightning Fast</h3>
          <p className="feature-description">
            Quick setup and rapid data extraction.
          </p>
        </div>

        {/* List Section */}
        <div className="list-section" data-aos="fade-left">
          <div className="list-item">
            <MdOutlineDashboardCustomize className="list-icon m-2" />
            <h3 className="list-title">Customizable</h3>
            <p className="list-description">
              Customize your data collection to match your specific needs. It's
              your data, your way.
            </p>
          </div>
          <div className="list-item">
            <FaShieldAlt className="list-icon m-2" />
            <h3 className="list-title">Secure and Reliable</h3>
            <p className="list-description">
              Rest easy knowing your data is protected by industry-standard
              security measures. We prioritize your data's safety.
            </p>
          </div>
        </div>
      </div>
      {/* Application Description Section */}
      <div
        className="feature-box application-description-section"
        data-aos="zoom-in-up">
        <LuClock4 className="section-icon" />
        <h2 className="section-heading">
          Stay Informed with Real-Time Updates
        </h2>
        <p className="section-subheading">
          Our application constantly monitors your selected websites for
          changes. Receive instant notifications so you never miss an
          opportunity.
        </p>
      </div>
      {/* Real-Time Notifications Section */}
      <div
        className="feature-box real-time-notifications-section"
        data-aos="zoom-in-up"
        data-aos-delay="100">
        <IoIosNotifications className="section-icon" />
        <h2 className="section-heading">Real-Time Notifications</h2>
        <p className="section-subheading">
          Set your preferences to receive updates via email, SMS, or push
          notifications. Stay connected to events as they happen.
        </p>
      </div>
      {/* Data Storage Section */}
      <div
        className="feature-box real-time-notifications-section"
        data-aos="zoom-in-up"
        data-aos-delay="200">
        <TiCloudStorageOutline className="section-icon" />
        <h2 className="section-heading">Dynamic Data at Your Fingertips</h2>
        <p className="section-subheading">
          Access and analyze the latest data scraped from your preferred sites.
          Your data is securely stored for future reference.
        </p>
      </div>
    </div>
  );
};

export default Home;
