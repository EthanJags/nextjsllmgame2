"use client";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <header className={isHomePage ? "fixed top-0 left-0 right-0 bg-primary text-white z-50" : ""}>
          <Navbar />
        </header>
        {children}
        <footer className={isHomePage ? "fixed bottom-0 left-0 right-0 bg-primary text-white z-50" : ""}>
          <Footer />
        </footer>
      </PersistGate>
    </Provider>
  );
}
