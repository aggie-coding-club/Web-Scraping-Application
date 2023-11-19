const Home = () => {
  return (
    <div className="bg-white p-5">
      <h1 className="text-4xl font-bold mb-4">Web Scraping Application</h1>
      <p className="text-lg mb-6">
        Want to stay updated on a website as soon as something new is released?
      </p>
      <div className="content py-5">
        <h2 className="text-2xl font-bold mb-4">Features:</h2>
        <ul className="list-disc ml-6">
          <li className="mb-2">Real-time website monitoring</li>
          <li className="mb-2">Automatic data extraction</li>
          <li className="mb-2">Email notifications</li>
          <li className="mb-2">Easy to use</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
