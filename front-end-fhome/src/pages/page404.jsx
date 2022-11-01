import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

function Page404() {
  return (
    <div className="layout">
      <CustomNavbar/>
      <main className='d-flex'>
        <div className="w-100 flex-column d-flex align-items-center justify-content-center">
          <h1>404</h1>
          <h2>Page not found!</h2>
        </div>
      </main>
      <CustomFooter/>
    </div>
  );
}

export default Page404;
