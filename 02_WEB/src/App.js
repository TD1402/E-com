import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import Header from "./components/Header/Header";
import Footer from "./components/footer/Footer";
import MainPages from "./components/mainpages/Pages";
import { TopHeader } from "./components/top-header/TopHeader";

function App() {
  const location = useLocation();
  const noHeaderPaths = ["/login", "/register", "/success"];
  const noFooterPaths = ["/dashboard", "/login", "/register", "/success"];
  const noTopHeaderPaths = ["/login", "/register", "/success"];
  const showHeader = !noHeaderPaths.includes(location.pathname);
  const showFooter = !noFooterPaths.includes(location.pathname);
  const showTopHeader = !noTopHeaderPaths.includes(location.pathname);

  return (
    <DataProvider>
      {showTopHeader && <TopHeader />}
      {showHeader && <Header />}
      <MainPages />
      {showFooter && <Footer />}
    </DataProvider>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
