import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
    // const location = useLocation();
    // console.log(location)
    // const hideNavbarAndFooter = ["/login", "/signup"].includes(location.pathname);

    return (
        <>
            {/* {!hideNavbarAndFooter && <Navbar />} */}
            <Outlet />
            {/* {!hideNavbarAndFooter && <Footer />} */}
        </>
    );
};

export default Layout;