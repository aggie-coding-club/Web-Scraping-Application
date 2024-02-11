import { useEffect } from "react";
import { Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

import HomeTable from "../assets/Table.png";
import "../styles/Home.css";

const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="flex">
                <div className="hero-section opacity-1 d-flex" data-aos="fade-up">
                    <div className="text-content">
                        <h1 className="hero-title">
                            <span className="highlight">Empower</span> your data collection
                        </h1>
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
                            }}
                        >
                            Get Started
                        </Button>
                    </div>
                    <div className="home-image ms-auto">
                        <img src={HomeTable} alt="Image" />
                    </div>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="feature-section" data-aos="fade-up" data-aos-delay="100">
                <div className="d-flex flex-column justify-content-center align-items-center feature" data-aos="fade-right" data-aos-delay="200">
                    <h3 className="feature-title">No Code Required</h3>
                    <p className="feature-description">Collect valuable data without any coding skills.</p>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center feature" data-aos="fade-right" data-aos-delay="300">
                    <h3 className="feature-title">Easy to Use</h3>
                    <p className="feature-description">User-friendly interface for seamless data collection.</p>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center feature" data-aos="fade-right" data-aos-delay="400">
                    <h3 className="feature-title">Real-Time Updates</h3>
                    <p className="feature-description">Receive instant notifications for new updates.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;