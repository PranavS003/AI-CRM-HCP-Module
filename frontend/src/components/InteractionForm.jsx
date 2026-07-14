import { useSelector } from "react-redux";

function InteractionForm() {
  const formData = useSelector((state) => state.crm.formData);
  const selectedInteraction = useSelector(
    (state) => state.crm.selectedInteraction
  );

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
        }}
      >
        <div>
          <label>Doctor Name</label>
          <input value={formData.doctor_name || ""} readOnly />
        </div>

        <div>
          <label>Hospital</label>
          <input value={formData.hospital || ""} readOnly />
        </div>

        <div>
          <label>Meeting Type</label>
          <input value={formData.meeting_type || ""} readOnly />
        </div>

        <div>
          <label>Product</label>
          <input value={formData.product || ""} readOnly />
        </div>

        <div>
          <label>Sentiment</label>
          <input value={formData.sentiment || ""} readOnly />
        </div>

        <div>
          <label>Materials Shared</label>
          <input value={formData.materials_shared || ""} readOnly />
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
        }}
      >
        <label>Follow-up Plan</label>

        <textarea
          rows={4}
          value={formData.follow_up || ""}
          readOnly
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