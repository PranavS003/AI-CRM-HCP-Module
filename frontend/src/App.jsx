import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

import Header from "./components/Header";
import InteractionForm from "./components/InteractionForm";
import AIChat from "./components/AIChat";
import InteractionHistory from "./components/InteractionHistory";

import { setInteractions } from "./store/crmSlice";

function App() {
  const dispatch = useDispatch();

  const interactions = useSelector((state) => state.crm.interactions);

  async function loadInteractions() {
    try {
      const res = await fetch("http://127.0.0.1:8000/interactions");
      const data = await res.json();
      dispatch(setInteractions(data));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadInteractions();
  }, []);

  return (
    <div className="container">
      <Header />

      <div className="main">
        <div style={{ flex: 2 }}>
          <InteractionForm loadInteractions={loadInteractions} />

          <InteractionHistory />
        </div>

        <AIChat loadInteractions={loadInteractions} />
      </div>
    </div>
  );
}

export default App;