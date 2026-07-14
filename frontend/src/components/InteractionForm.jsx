import { useDispatch, useSelector } from "react-redux";
import { updateFormField } from "../store/crmSlice";

function InteractionForm() {
  const dispatch = useDispatch();

  const formData = useSelector((state) => state.crm.formData);
  const selectedInteraction = useSelector(
    (state) => state.crm.selectedInteraction
  );

  function handleChange(e) {
    dispatch(
      updateFormField({
        field: e.target.name,
        value: e.target.value,
      })
    );
  }

  async function handleSave() {
    if (!selectedInteraction) {
      alert("Please select an interaction first.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/interaction/${selectedInteraction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      alert(data.message || "Interaction Updated Successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update interaction.");
    }
  }

  const createdAt = selectedInteraction?.created_at || "";

  let formattedDate = "";
  let formattedTime = "";

  if (createdAt) {
    const date = new Date(createdAt.replace(" ", "T"));

    formattedDate = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

    formattedTime = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }

  return (
    <div className="left-panel">
      <h2>HCP Interaction Details</h2>

      {selectedInteraction && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#eef4ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#2563eb",
            fontWeight: 600,
          }}
        >
          <span>Selected Interaction</span>
          <span>#{selectedInteraction.id}</span>
        </div>
      )}

      {createdAt && (
        <div
          style={{
            display: "flex",
            gap: "25px",
            marginBottom: "18px",
            color: "#555",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <span>📅 {formattedDate}</span>
          <span>🕒 {formattedTime}</span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
        }}
      >
        <div>
          <label>Doctor Name</label>
          <input
            name="doctor_name"
            value={formData.doctor_name || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Hospital</label>
          <input
            name="hospital"
            value={formData.hospital || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Meeting Type</label>
          <input
            name="meeting_type"
            value={formData.meeting_type || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Product</label>
          <input
            name="product"
            value={formData.product || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label>Topics Discussed</label>
        <textarea
          rows={3}
          name="topics_discussed"
          placeholder="Key discussion points..."
          value={formData.topics_discussed || ""}
          onChange={handleChange}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          marginTop: 18,
        }}
      >
        <div>
          <label>Observed HCP Sentiment</label>

          <select
            name="sentiment"
            value={(formData.sentiment || "").toLowerCase()}
            onChange={handleChange}
          >
            <option value="">Select Sentiment</option>
            <option value="positive">😊 Positive</option>
            <option value="neutral">😐 Neutral</option>
            <option value="negative">☹️ Negative</option>
          </select>
        </div>

        <div>
          <label>Materials Shared</label>

          <input
            name="materials_shared"
            value={formData.materials_shared || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label>Outcomes</label>

        <textarea
          rows={3}
          name="outcomes"
          placeholder="Key outcomes or agreements..."
          value={formData.outcomes || ""}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <label>Follow-up Actions</label>

        <textarea
          rows={4}
          name="follow_up"
          placeholder="Next steps..."
          value={formData.follow_up || ""}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: 24,
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

export default InteractionForm;