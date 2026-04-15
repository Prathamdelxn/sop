import mongoose from "mongoose";

// Only import dns in server environment
let dns;
let dnsPromises;

if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  // This is a Node.js environment
  try {
    dns = await import('dns');
    dnsPromises = dns.promises;
  } catch (e) {
    console.warn("DNS module not available, using standard connection only");
  }
}

/**
 * Manually resolves MongoDB SRV and TXT records to construct a standard connection string.
 * This is a fallback for environments where Node's internal SRV resolution fails (ECONNREFUSED).
 */
async function resolveManualUri(srvUri) {
  if (!dnsPromises) {
    console.log("DNS module not available, skipping manual resolution");
    return null;
  }

  try {
    console.log("🔍 Attempting manual SRV resolution...");
    const url = new URL(srvUri.replace("mongodb+srv://", "http://"));
    const username = url.username;
    const password = url.password;
    const hostname = url.hostname;
    const searchParams = url.searchParams;

    // 1. Resolve SRV records
    const srvHostname = `_mongodb._tcp.${hostname}`;
    const srvRecords = await dnsPromises.resolveSrv(srvHostname);
    if (!srvRecords || srvRecords.length === 0) {
      throw new Error("No SRV records found");
    }

    const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(",");

    // 2. Resolve TXT records for options (like replicaSet)
    let extraOptions = "";
    try {
      const txtRecords = await dnsPromises.resolveTxt(hostname);
      if (txtRecords && txtRecords.length > 0) {
        extraOptions = txtRecords.flat().join("&");
      }
    } catch (e) {
      console.warn("⚠️ TXT resolution failed, using default options:", e.message);
    }

    // 3. Construct Standard URI
    const finalOptions = new URLSearchParams(searchParams);
    if (extraOptions) {
      const txtParams = new URLSearchParams(extraOptions);
      txtParams.forEach((value, key) => finalOptions.set(key, value));
    }

    // Ensure ssl is true for Atlas
    if (!finalOptions.has("ssl") && !finalOptions.has("tls")) {
      finalOptions.set("ssl", "true");
    }

    const standardUri = `mongodb://${username}:${password}@${hosts}/?${finalOptions.toString()}`;
    console.log("✅ Manual URI constructed successfully");
    return standardUri;
  } catch (error) {
    console.error("❌ Manual resolution failed:", error.message);
    return null;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI missing from environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("👉 dbConnect called");

  // Configure DNS only in Node.js environment
  if (dns && typeof dns.setDefaultResultOrder === 'function') {
    try {
      dns.setDefaultResultOrder("ipv4first");
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      console.warn("⚠️ Failed to set DNS servers:", e.message);
    }
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("⚡ Using ACTIVE cached connection");
    return cached.conn;
  }

  console.log("⏳ Creating new connection...");

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "sop",
    };

    // Try standard connection first
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .catch(async (err) => {
        // If it's a DNS SRV error, try the manual fallback
        if ((err.message && (err.message.includes("querySrv") || err.message.includes("SRV"))) || err.code === "ECONNREFUSED") {
          console.warn("⚠️ SRV Connection failed, trying Smart Fallback...");
          const manualUri = await resolveManualUri(MONGODB_URI);
          if (manualUri) {
            console.log("🔄 Retrying with standard connection string...");
            return mongoose.connect(manualUri, opts);
          }
        }
        throw err;
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected:", mongoose.connection.host);
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("❌ Final Connection failed:", error);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;