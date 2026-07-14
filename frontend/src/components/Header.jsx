function Header() {
  return (
    <header
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "24px 30px",
        marginBottom: "24px",
        border: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 25px rgba(15,23,42,.06)",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: "#2563eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            color: "white",
          }}
        >
          🏥
        </div>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              color: "#0f172a",
              fontWeight: "700",
            }}
          >
            Healthcare CRM
          </h1>

          <p
            style={{
              marginTop: "6px",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Healthcare Professional (HCP) Interaction Management
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 10px rgba(34,197,94,.6)",
          }}
        />

        <div>
          <div
            style={{
              fontWeight: "600",
              color: "#0f172a",
              fontSize: "15px",
            }}
          >
            AI Assistant
          </div>

          <div
            style={{
              color: "#22c55e",
              fontSize: "13px",
            }}
          >
            Online 
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;