import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setFormData } from "../store/crmSlice";

function formatSearchResults(results) {
  if (!results || results.length === 0) {
    return "No matching interactions found.";
  }

  return results
    .map((item) => {
      return `${item.doctor_name || "-"}  (ID: ${item.id})

Hospital : ${item.hospital || "-"}

Product : ${item.product || "-"}

Sentiment : ${item.sentiment || "-"}

Logged on : ${item.created_at || "-"}`;
    })
    .join("\n\n———\n\n");
}

function AIChat({ loadInteractions }) {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Welcome! Describe your interaction...",
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userMessage,
        }),
      });

      const data = await res.json();

      let assistantReply = "Interaction processed.";

      if (data.data) {
        dispatch(
          setFormData({
            doctor_name: data.data.doctor_name || "",
            hospital: data.data.hospital || "",
            meeting_type: data.data.meeting_type || "",
            product: data.data.product || "",
            topics_discussed: data.data.topics_discussed || "",
            sentiment: data.data.sentiment || "",
            materials_shared: data.data.materials_shared || "",
            outcomes: data.data.outcomes || "",
            follow_up: data.data.follow_up || "",
          })
        );

        assistantReply = `✅ Interaction Logged Successfully

Doctor : ${data.data.doctor_name || "-"}

Hospital : ${data.data.hospital || "-"}

Meeting : ${data.data.meeting_type || "-"}

Product : ${data.data.product || "-"}

Sentiment : ${data.data.sentiment || "-"}

The CRM form has been updated automatically.`;
      } else if (data.summary) {
        assistantReply = data.summary;
      } else if (data.results) {
        assistantReply = formatSearchResults(data.results);
      } else if (data.suggestions) {
        assistantReply = data.suggestions;
      } else if (data.message) {
        assistantReply = data.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: assistantReply,
        },
      ]);

      if (loadInteractions) {
        await loadInteractions();
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Unable to connect to the backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="right-panel">

      <div className="ai-chat-header">

        <div className="ai-chat-header-title">

          <span>🤖</span>

          <span>AI Assistant</span>

          <span className="ai-status-dot"></span>

        </div>

      </div>

      <div className="chat-box">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.role}`}
          >
            <div className="chat-bubble">
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />

      </div>

      <div className="chat-input-container">

  <textarea
    rows={4}
    value={input}
    disabled={loading}
    placeholder="Describe your interaction..."
    onChange={(e) => setInput(e.target.value)}
  />

  <button
    className="send-btn"
    onClick={handleSend}
    disabled={loading}
  >
    {loading ? "Processing..." : "Send"}
  </button>

</div>

    </div>
  );
}

export default AIChat;