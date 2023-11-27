const NotFoundPage = () => {
  return (
    <div className="p-5">
      <h1>404</h1>
      <div className="d-flex flex-row gap-1">
        <p className="text-danger">{window.location.pathname}</p>
        <p>not found</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
