var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_child_process = require("child_process");
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var SEARCH_SCRIPT_PATH = import_path.default.join(
  process.cwd(),
  ".gemini/skills/ui-ux-pro-max/scripts/search.py"
);
var SEARCH_SCRIPT_FALLBACK = import_path.default.join(
  process.cwd(),
  ".agents/skills/ui-ux-pro-max/scripts/search.py"
);
function getScriptPath() {
  if (import_fs.default.existsSync(SEARCH_SCRIPT_PATH)) {
    return SEARCH_SCRIPT_PATH;
  }
  if (import_fs.default.existsSync(SEARCH_SCRIPT_FALLBACK)) {
    return SEARCH_SCRIPT_FALLBACK;
  }
  return SEARCH_SCRIPT_PATH;
}
var MASTER_ADMIN_EMAIL = "nexgriddigital@gmail.com";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "NexGrid@2026!Admin";
var provisionedClientsStore = /* @__PURE__ */ new Map();
var otpStore = /* @__PURE__ */ new Map();
app.post("/api/auth/admin-login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== MASTER_ADMIN_EMAIL) {
    return res.status(403).json({
      error: "Access Denied: Only the primary administrator (nexgriddigital@gmail.com) can access the Admin Operations Portal."
    });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid administrator password. Access denied." });
  }
  return res.json({
    success: true,
    user: {
      id: "admin-master-001",
      email: MASTER_ADMIN_EMAIL,
      name: "NexGrid Operations Admin",
      role: "admin",
      company: "NexGrid Digital Solutions",
      phone: "+251 906697634"
    }
  });
});
app.post("/api/auth/client-login", (req, res) => {
  const { email, accessKey } = req.body;
  if (!email || !accessKey) {
    return res.status(400).json({ error: "Client business email and access key are required." });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const clientRecord = provisionedClientsStore.get(normalizedEmail);
  if (!clientRecord) {
    return res.status(403).json({
      error: "Access Denied: This account has not been provisioned by the NexGrid Administrator. Prospective clients must contact nexgriddigital@gmail.com to establish a retainer and receive login credentials."
    });
  }
  if (clientRecord.status !== "active") {
    return res.status(403).json({
      error: "Account Suspended: This client retainer account is currently inactive. Contact nexgriddigital@gmail.com."
    });
  }
  if (clientRecord.accessKey !== accessKey.trim()) {
    return res.status(401).json({
      error: "Invalid access key. Please verify the credentials provided by your NexGrid account manager."
    });
  }
  return res.json({
    success: true,
    user: {
      id: clientRecord.id,
      email: clientRecord.email,
      name: clientRecord.name,
      role: "client",
      company: clientRecord.company,
      contractId: clientRecord.contractId
    },
    client: clientRecord
  });
});
app.post("/api/admin/provision-client", (req, res) => {
  const {
    adminEmail,
    email,
    name,
    company,
    tier = "Scale & Performance",
    hoursAllocated = 50,
    slaHours = 4,
    monthlyFee = 7500,
    customAccessKey
  } = req.body;
  if (!adminEmail || adminEmail.trim().toLowerCase() !== MASTER_ADMIN_EMAIL) {
    return res.status(403).json({ error: "Unauthorized: Only nexgriddigital@gmail.com can provision client accounts." });
  }
  if (!email || !name || !company) {
    return res.status(400).json({ error: "Client email, name, and company are required." });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === MASTER_ADMIN_EMAIL) {
    return res.status(400).json({ error: "Cannot provision administrator email as client." });
  }
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  const accessKey = customAccessKey && customAccessKey.trim() ? customAccessKey.trim() : `NXG-${randomSuffix}`;
  const clientId = `client-${Date.now()}`;
  const contractId = `contract-${Date.now()}`;
  const clientRecord = {
    id: clientId,
    email: normalizedEmail,
    name: name.trim(),
    company: company.trim(),
    accessKey,
    contractId,
    tier,
    hoursAllocated: Number(hoursAllocated) || 50,
    slaHours: Number(slaHours) || 4,
    monthlyFee: Number(monthlyFee) || 7500,
    status: "active",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    provisionedBy: MASTER_ADMIN_EMAIL
  };
  provisionedClientsStore.set(normalizedEmail, clientRecord);
  console.log(`[NexGrid Admin] Successfully provisioned client account: ${normalizedEmail} (Key: ${accessKey})`);
  return res.json({
    success: true,
    message: `Client account successfully provisioned for ${name} (${company})`,
    client: clientRecord
  });
});
app.get("/api/admin/provisioned-clients", (req, res) => {
  const adminEmail = req.headers["x-admin-email"] || req.query.adminEmail;
  if (adminEmail !== MASTER_ADMIN_EMAIL) {
    return res.status(403).json({ error: "Unauthorized: Administrator access required." });
  }
  const clients = Array.from(provisionedClientsStore.values());
  return res.json({ clients });
});
app.post("/api/admin/revoke-client", (req, res) => {
  const { adminEmail, clientEmail } = req.body;
  if (adminEmail !== MASTER_ADMIN_EMAIL) {
    return res.status(403).json({ error: "Unauthorized: Administrator access required." });
  }
  if (!clientEmail) {
    return res.status(400).json({ error: "Client email is required." });
  }
  const normalized = clientEmail.trim().toLowerCase();
  if (provisionedClientsStore.has(normalized)) {
    provisionedClientsStore.delete(normalized);
    return res.json({ success: true, message: `Access revoked for ${normalized}` });
  }
  return res.status(404).json({ error: "Client account not found." });
});
app.post("/api/auth/request-otp", (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Valid business email address is required" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const isAdmin = normalizedEmail === MASTER_ADMIN_EMAIL;
  const isProvisionedClient = provisionedClientsStore.has(normalizedEmail);
  if (!isAdmin && !isProvisionedClient) {
    return res.status(403).json({
      error: "Access Denied: Unregistered email. Registrants must be issued an authorized login by NexGrid Operations (nexgriddigital@gmail.com)."
    });
  }
  const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
  const expiresAt = Date.now() + 10 * 60 * 1e3;
  otpStore.set(normalizedEmail, {
    code: otp,
    expiresAt,
    email: normalizedEmail
  });
  console.log(`[NexGrid Auth] Secure OTP dispatched for authorized account ${normalizedEmail}: ${otp}`);
  return res.json({
    success: true,
    message: `Verification passcode dispatched to ${normalizedEmail}`,
    email: normalizedEmail,
    devOtp: otp,
    // available in dev session
    expiresInSeconds: 600
  });
});
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP code are required" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const record = otpStore.get(normalizedEmail);
  if (!record || record.code !== otp.trim() || record.expiresAt < Date.now()) {
    return res.status(401).json({ error: "Invalid or expired verification code." });
  }
  otpStore.delete(normalizedEmail);
  if (normalizedEmail === MASTER_ADMIN_EMAIL) {
    return res.json({
      success: true,
      user: {
        id: "admin-master-001",
        email: MASTER_ADMIN_EMAIL,
        name: "NexGrid Operations Admin",
        role: "admin",
        company: "NexGrid Digital Solutions",
        phone: "+251 906697634"
      }
    });
  }
  const client = provisionedClientsStore.get(normalizedEmail);
  if (client) {
    return res.json({
      success: true,
      user: {
        id: client.id,
        email: client.email,
        name: client.name,
        role: "client",
        company: client.company,
        contractId: client.contractId
      }
    });
  }
  return res.status(403).json({ error: "Account not authorized." });
});
app.get("/api/status", (req, res) => {
  const scriptPath = getScriptPath();
  const exists = import_fs.default.existsSync(scriptPath);
  res.json({
    status: "ready",
    skill: "UI/UX Pro Max v2.0",
    repository: "nextlevelbuilder/ui-ux-pro-max-skill",
    pythonAvailable: true,
    scriptAvailable: exists,
    scriptPath,
    capabilities: {
      reasoningRules: 192,
      uiStyles: 79,
      activeStyles: 50,
      colorPalettes: 192,
      fontPairings: 74,
      uxGuidelines: 119,
      chartTypes: 25,
      supportedStacks: 22
    }
  });
});
app.post("/api/design-system", (req, res) => {
  const { query, projectName, variance, motion, density } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing required 'query' parameter" });
  }
  const scriptPath = getScriptPath();
  const args = [scriptPath, query.trim(), "--design-system", "--json"];
  if (projectName && typeof projectName === "string") {
    args.push("-p", projectName.trim());
  }
  if (variance && Number(variance) >= 1 && Number(variance) <= 10) {
    args.push("--variance", String(variance));
  }
  if (motion && Number(motion) >= 1 && Number(motion) <= 10) {
    args.push("--motion", String(motion));
  }
  if (density && Number(density) >= 1 && Number(density) <= 10) {
    args.push("--density", String(density));
  }
  (0, import_child_process.execFile)("python3", args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("Design system generation failed:", stderr || err.message);
      return res.status(500).json({
        error: "Failed to generate design system",
        details: stderr || err.message
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseErr) {
      console.error("Failed to parse JSON output:", stdout);
      res.status(500).json({
        error: "Failed to parse design system JSON output",
        rawOutput: stdout
      });
    }
  });
});
app.get("/api/search", (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const domain = typeof req.query.domain === "string" ? req.query.domain.trim() : "";
  const stack = typeof req.query.stack === "string" ? req.query.stack.trim() : "";
  const maxResults = typeof req.query.limit === "string" ? req.query.limit.trim() : "5";
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }
  const scriptPath = getScriptPath();
  const args = [scriptPath, query, "--json", "--max-results", maxResults];
  if (domain) {
    args.push("--domain", domain);
  }
  if (stack) {
    args.push("--stack", stack);
  }
  (0, import_child_process.execFile)("python3", args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("Search failed:", stderr || err.message);
      return res.status(500).json({
        error: "Search failed",
        details: stderr || err.message
      });
    }
    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseErr) {
      res.status(500).json({
        error: "Failed to parse search output",
        rawOutput: stdout
      });
    }
  });
});
app.post("/api/persist", (req, res) => {
  const { query, projectName, page } = req.body;
  if (!query || !projectName) {
    return res.status(400).json({ error: "Query and projectName are required" });
  }
  const scriptPath = getScriptPath();
  const args = [
    scriptPath,
    query.trim(),
    "--design-system",
    "--persist",
    "-p",
    projectName.trim(),
    "--force",
    "--output-dir",
    process.cwd()
  ];
  if (page) {
    args.push("--page", page.trim());
  }
  (0, import_child_process.execFile)("python3", args, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: "Persistence failed", details: stderr || err.message });
    }
    res.json({
      success: true,
      message: `Persisted design system for ${projectName}`,
      output: stdout
    });
  });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UI/UX Pro Max Hub server listening on http://0.0.0.0:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
