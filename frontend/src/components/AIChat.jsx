import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFormData } from "../store/crmSlice";

function AIChat({ loadInteractions }) {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
        }),
      });

      const data = await res.json();

      console.log(data);

      // ------------------------
      // LOG / EDIT
      // ------------------------

      if (data.data) {
        dispatch(
          setFormData({
            doctor_name: data.data.doctor_name || "",
            hospital: data.data.hospital || "",
            meeting_type: data.data.meeting_type || "",
            product: data.data.product || "",
            sentiment: data.data.sentiment || "",
            materials_shared: data.data.materials_shared || "",
            follow_up: data.data.follow_up || "",
          })
        );

        setResponse("✅ Interaction processed successfully.");
      }

      // ------------------------
      // SEARCH
      // ------------------------

      else if (data.results) {
        setResponse(JSON.stringify(data.results, null, 2));
      }

      // ------------------------
      // SUMMARY
      // ------------------------

      else if (data.summary) {
        setResponse(data.summary);
      }

      // ------------------------
      // FOLLOW UP
      // ------------------------

      else if (data.suggestions) {
        setResponse(data.suggestions);
      }

      // ------------------------
      // ERROR
      // ------------------------

      else if (data.message) {
        setResponse(data.message);
      }

      else {
        setResponse(JSON.stringify(data, null, 2));
      }

      if (loadInteractions) {
        await loadInteractions();
      }

      setInput("");

    } catch (err) {

      console.error(err);

      setResponse("❌ Backend Error");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="right-panel">

      <h2>AI Assistant</h2>

      <div className="chat-box">
        <pre>{response}</pre>
      </div>

      <textarea
        rows="6"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your interaction..."
        disabled={loading}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{ marginTop: "10px" }}
      >
        {loading ? "Processing..." : "Send"}
      </button>

    </div>
  );
}

export default AIChat;