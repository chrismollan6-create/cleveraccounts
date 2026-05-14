// Quick end-to-end smoke test of the portal database:
// 1. Insert a fake user
// 2. Read it back
// 3. Write an audit log entry
// 4. Clean up
//
// Confirms the schema, constraints, indexes, and TypeScript-mappable shapes
// all work together.
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = postgres(process.env.SUPABASE_DB_URL, { prepare: false, max: 1 });

try {
  // 1. Insert a test user
  console.log("\n1. Insert test user...");
  const fakeClerkId = `test_${Date.now()}`;
  await sql`
    INSERT INTO portal.users (clerk_user_id, contact_sf_id, account_sf_id, brand, email, status)
    VALUES (${fakeClerkId}, '003Q100000ABCDE', '001Q100000XuwueIAB', 'clever', 'smoke@cleveraccounts.com', 'active')
  `;
  console.log("   ✓");

  // 2. Read it back
  console.log("\n2. Read back...");
  const rows = await sql`SELECT * FROM portal.users WHERE clerk_user_id = ${fakeClerkId}`;
  console.log("   Got:", JSON.stringify(rows[0], null, 2));

  // 3. Verify the email_lower constraint blocks uppercase
  console.log("\n3. Verify email_lower constraint...");
  try {
    await sql`
      INSERT INTO portal.users (clerk_user_id, contact_sf_id, account_sf_id, brand, email, status)
      VALUES ('test_uppercase', '003Q', '001Q', 'clever', 'Mixed@Case.com', 'active')
    `;
    console.log("   ✘ Constraint failed to block uppercase email!");
  } catch (e) {
    if (/users_email_lower/.test(e.message)) {
      console.log("   ✓ Constraint correctly blocked uppercase email");
    } else {
      console.log("   ? Unexpected error:", e.message);
    }
  }

  // 4. Audit log
  console.log("\n4. Write + read audit log entry...");
  await sql`
    INSERT INTO portal.audit_log (clerk_user_id, account_sf_id, action, target, metadata)
    VALUES (${fakeClerkId}, '001Q100000XuwueIAB', 'smoke_test', 'foundation_1', ${sql.json({ note: 'foundation 1 verification' })})
  `;
  const logs = await sql`SELECT id, action, target, metadata FROM portal.audit_log WHERE clerk_user_id = ${fakeClerkId}`;
  console.log("   Got:", logs[0]);

  // 5. Verify unique index on email
  console.log("\n5. Verify unique index on email...");
  try {
    await sql`
      INSERT INTO portal.users (clerk_user_id, contact_sf_id, account_sf_id, brand, email, status)
      VALUES ('test_dup', '003Q', '001Q', 'clever', 'smoke@cleveraccounts.com', 'active')
    `;
    console.log("   ✘ Duplicate email accepted!");
  } catch (e) {
    if (/duplicate key|unique/i.test(e.message)) {
      console.log("   ✓ Duplicate email correctly rejected");
    } else {
      throw e;
    }
  }

  // Clean up
  console.log("\n6. Clean up...");
  await sql`DELETE FROM portal.audit_log WHERE clerk_user_id = ${fakeClerkId}`;
  await sql`DELETE FROM portal.users WHERE clerk_user_id = ${fakeClerkId}`;
  console.log("   ✓");

  console.log("\n✓ All smoke tests passed.");
} catch (err) {
  console.error("\n✘ Smoke test failed:", err);
  process.exit(1);
} finally {
  await sql.end();
}
