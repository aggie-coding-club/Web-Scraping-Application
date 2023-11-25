import { MdCodeOff } from "react-icons/md";
import { FaCheck, FaShieldAlt } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TiCloudStorageOutline } from "react-icons/ti";

const Home = () => {
  return (
    <div className="bg-white w-100 p-5">
      {/* Hero */}
      <div className="pb-5">
        <div className="hstack gap-3">
          <h1 className="fw-light mb-4 text-lowercase">Collect data</h1>
          <h1 className="text-primary font-bold mb-4 text-lowercase">
            smartly
          </h1>
        </div>

        <p className="fs-4 mb-6">
          Collect data from any website, no matter how complex, with just a few
          clicks
        </p>
      </div>

      {/* Description */}
      <div className="d-flex justify-content-evenly">
        <div className="d-flex p-3 justify-content-evenly bg-secondary w-25 rounded-pill shadow fw-bold text-center text-white">
          <MdCodeOff size={40} />
          <p className="pt-2">No code required</p>
        </div>
        <div className="d-flex p-3 justify-content-evenly bg-secondary w-25 rounded-pill shadow fw-bold text-center text-white">
          <FaCheck size={40} />
          <p className="pt-2">Easy to use</p>
        </div>
        <div className="d-flex p-3 justify-content-evenly bg-secondary w-25 rounded-pill shadow fw-bold text-center text-white">
          <BsLightningFill className="" size={40} />
          <p className="pt-2">Lightning fast</p>
        </div>
      </div>

      <div className="py-5 mt-5">
        <ul className="list-group list-group-flush">
          <div className="d-flex gap-3 list-group-item">
            <MdOutlineDashboardCustomize size={40} />
            <p className="fs-5 p-1">Heavily customizable</p>
          </div>

          <div className="d-flex gap-3 list-group-item">
            <FaShieldAlt size={35} />
            <p className="fs-5 p-1">Your data is safe with us</p>
          </div>

          <div className="d-flex gap-3 list-group-item">
            <TiCloudStorageOutline size={40} />
            <p className="fs-5 p-1">Unlimited storage space</p>
          </div>
        </ul>
      </div>
      <div className="d-flex justify-content-evenly py-5">
        <div
          className="card text-bg-secondary shadow mb-3"
          style={{ maxWidth: "18rem" }}>
          <div className="card-header fw-bold">
            Real-time website monitoring
          </div>
          <div className="card-body">
            <p className="card-text">
              Automatically monitor websites for changes.
            </p>
          </div>
        </div>

        <div
          className="card text-bg-secondary shadow mb-3"
          style={{ maxWidth: "18rem" }}>
          <div className="card-header fw-bold">Automatic data extraction</div>
          <div className="card-body">
            <p className="card-text">
              Get structured data from any website, no matter how complex.
            </p>
          </div>
        </div>

        <div
          className="card text-bg-secondary shadow mb-3"
          style={{ maxWidth: "18rem" }}>
          <div className="card-header fw-bold">Get notified instantly</div>
          <div className="card-body">
            <p className="card-text">
              Get notified instantly when a website changes.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="d-flex justify-content-center pt-5">
        <button className="btn btn-lg btn-primary p-3 fw-bold rounded-pill shadow">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
