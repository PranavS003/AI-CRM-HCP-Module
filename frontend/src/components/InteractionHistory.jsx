import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  setSelectedInteraction,
} from "../store/crmSlice";

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function InteractionHistory() {
  const dispatch = useDispatch();

  const interactions = useSelector((state) => state.crm.interactions);
  const selectedInteraction = useSelector(
    (state) => state.crm.selectedInteraction
  );

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const value = search.toLowerCase();

    return interactions.filter((item) => {
      return (
        (item.doctor_name || "").toLowerCase().includes(value) ||
        (item.hospital || "").toLowerCase().includes(value) ||
        (item.product || "").toLowerCase().includes(value)
      );
    });
  }, [interactions, search]);

  async function deleteInteraction(id) {
    const ok = window.confirm(
      "Are you sure you want to delete this interaction?"
    );

    if (!ok) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/interaction/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Backend Error");
    }
  }

  return (
    <div className="history-panel">
      <h2>Interaction History</h2>

      <input
        type="text"
        placeholder="Search doctor, hospital, product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      {filtered.length === 0 ? (
        <p className="muted-text">No interactions found.</p>
      ) : (
        filtered.map((item, index) => (
          <div
            key={item.id}
            className={`history-card compact ${
              selectedInteraction?.id === item.id
                ? "history-card-active"
                : ""
            }`}
            onClick={() => {
              dispatch(setSelectedInteraction(item));

              dispatch(
                setFormData({
                  doctor_name: item.doctor_name,
                  hospital: item.hospital,
                  meeting_type: item.meeting_type,
                  product: item.product,
                  sentiment: item.sentiment,
                  materials_shared: item.materials_shared,
                  follow_up: item.follow_up,
                })
              );
            }}
          >
            <span className="history-card-index">{index + 1}</span>

            <div className="history-card-main">
              <div className="history-card-heading">
                <strong>{item.doctor_name}</strong>
              </div>

              <div className="history-card-sub">
                {item.hospital}
                {item.product ? ` · ${item.product}` : ""}
              </div>

              <small>{item.created_at}</small>
            </div>

            <button
              className="icon-button icon-button-danger"
              title="Delete interaction"
              onClick={(e) => {
                e.stopPropagation();
                deleteInteraction(item.id);
              }}
            >
              <TrashIcon />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default InteractionHistory;