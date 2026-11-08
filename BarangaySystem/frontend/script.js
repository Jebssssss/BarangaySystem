function $(id) {
  return document.getElementById(id);
}

function esc(text = "") {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}

async function api(url, method = "GET", body) {
  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 401) {
    location.hash = "#/login";
    throw new Error("Please log in");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function toast(message, isError = false) {
  const box = $("toast");
  box.textContent = message;
  box.className = "toast show" + (isError ? " error" : "");

  setTimeout(() => {
    box.className = "toast";
  }, 3000);
}

const routes = {};
const PAGES = [
  ["dashboard", "Dashboard"],
  ["residents", "Residents"],
  ["requests", "Requests"]
];

function showPage() {
  const parts = location.hash.replace("#/", "").split("/");
  const name = parts[0];
  const extra = parts[1];
  const key = routes[name] ? name : "dashboard";
  const isLogin = key === "login";

  document.body.className = isLogin ? "login-body" : "";
  $("nav").classList.toggle("hidden", isLogin);

  let links = "";
  for (let page of PAGES) {
    const active = page[0] === key ? "active" : "";
    links += `<a href="#/${page[0]}" class="${active}">${page[1]}</a>`;
  }
  $("nav").innerHTML = `<div class="brand">Barangay System</div>${links}<a href="#" id="logout">Logout</a>`;

  $("logout").addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch("/logout", { method: "POST" });
    location.hash = "#/login";
  });
  $("view").innerHTML = routes[key].html();
  routes[key].init(extra);
}
document.body.insertAdjacentHTML("beforeend", '<div id="toast" class="toast"></div>');

window.addEventListener("hashchange", showPage);
window.addEventListener("load", showPage);
