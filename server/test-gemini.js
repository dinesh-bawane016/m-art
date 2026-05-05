const API_KEY = "AIzaSyC6yWYlYdt-F-RlrsexTSj22NDLo7mg-oo";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function run() {
  const res = await fetch(url);
  console.log("Status:", res.status, res.statusText);
  const json = await res.json();
  if (json.models) {
    console.log("Available models:", json.models.map(m => m.name).join(", "));
  } else {
    console.log("Body:", json);
  }
}
run();
