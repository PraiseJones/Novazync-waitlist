// db/test-connection.js
const { pool } = require("./index.js");

async function testConnection() {
  let client;
  try {
    // Try to get a client from the pool
    client = await pool.connect();
    console.log("✅ Successfully connected to PostgreSQL database");

    // Test a simple query
    const result = await client.query("SELECT NOW()");
    console.log("✅ Test query successful. Server time:", result.rows[0].now);

    // Get database info
    const dbInfo = await client.query(`
            SELECT 
                current_database() as database,
                current_user as user,
                version() as version,
                inet_server_addr() as server_address,
                inet_server_port() as server_port
        `);
    console.log("\nDatabase Information:");
    console.table(dbInfo.rows[0]);
  } catch (err) {
    console.error("\n❌ Database connection error:", err.message);
    console.error("\nConnection details (check these in your .env file):");
    console.log("- DB_USER:", process.env.DB_USER);
    console.log("- DB_HOST:", process.env.DB_HOST);
    console.log("- DB_NAME:", process.env.DB_NAME);
    console.log("- DB_PORT:", process.env.DB_PORT);
    console.log(
      "\nIf using production DATABASE_URL:",
      process.env.DATABASE_URL ? "✓ Set" : "✗ Not set"
    );
  } finally {
    if (client) {
      client.release();
      await pool.end();
    }
  }
}

// Run the test
console.log("Testing database connection...\n");
testConnection()
  .then(() => {
    console.log("\nConnection test complete.");
    process.exit(0);
  })
  .catch(() => {
    console.log("\nConnection test failed.");
    process.exit(1);
  });
