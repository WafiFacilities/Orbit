const supabase = supabase.createClient(
  "https://kqhbvmqxrwwspopwckah.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaGJ2bXF4cnd3c3BvcHdja2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTYyOTAsImV4cCI6MjA4NjI5MjI5MH0.uKfFMK7GBtCR8P5n7hsJlN72-w5h0oyOhuaySphmns8"
);

// LOGIN
async function login() {
  await supabase.auth.signInWithOAuth({ provider: "google" });
}

async function logout() {
  await supabase.auth.signOut();
}

// LOAD DATA
async function loadInitiatives() {
  const { data, error } = await supabase
    .from("initiatives")
    .select("*")
    .order("id", { ascending: true });

  const table = document.getElementById("initiativeTable");
  table.innerHTML = "";

  data.forEach(row => {
    table.innerHTML += `
      <tr>
        <td>${row.id}</td>
        <td>${row.terminal_name}</td>
        <td>${row.initiative_name}</td>
        <td>${row.status}</td>
        <td>${row.target_date || ""}</td>
        <td>${row.sponsor || ""}</td>
      </tr>
    `;
  });
}

// FORM SUBMIT
document.getElementById("initiativeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const record = {
    terminal_name: terminal.value,
    initiative_name: initiative.value,
    status: status.value,
    description: description.value,
    impact: impact.value,
    target_date: target.value,
    commentary: commentary.value,
    sponsor: sponsor.value,
    team_members: team.value
  };

  await supabase.from("initiatives").insert(record);
  loadInitiatives();
  e.target.reset();
});

// AUTH LISTENER
supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_IN") loadInitiatives();
});
