import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import "../components/Layout.css";

// Rendera innehåll med outlet för huvudinnehåll
const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout