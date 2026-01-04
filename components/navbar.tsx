const Navbar = () => {
  return (
    <>
      <div className="w-screen centered pt-3">
        <div className="navbar centered flex-row justify-between px-6">
          <div className="centered">
            <h3 className="m-0 cursor-pointer">Taxsavvy</h3>
          </div>

          <div className="centered flex-row">
            <div className="pill-btn centered">Filing</div>
            <div className="pill-btn centered">Reforms</div>
            <div className="pill-btn centered">Learn</div>
            <div className="pill-btn centered">About</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
