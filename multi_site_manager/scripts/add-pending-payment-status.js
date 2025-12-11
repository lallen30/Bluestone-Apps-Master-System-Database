#!/usr/bin/env node
/**
 * Add pending_payment status to property_bookings table
 * Usage: node scripts/add-pending-payment-status.js
 */

const db = require("../src/config/database");

async function addPendingPaymentStatus() {
  try {
    console.log("Adding pending_payment status to property_bookings...");

    await db.query(`
      ALTER TABLE property_bookings 
      MODIFY COLUMN status ENUM('pending', 'pending_payment', 'confirmed', 'cancelled', 'completed', 'rejected') 
      DEFAULT 'pending'
    `);

    console.log("✓ Successfully added pending_payment status");

    // Verify
    const result = await db.query(`
      SHOW COLUMNS FROM property_bookings WHERE Field = 'status'
    `);

    console.log("\nStatus column definition:");
    console.log(result);

    process.exit(0);
  } catch (error) {
    console.error("Error adding pending_payment status:", error);
    process.exit(1);
  }
}

addPendingPaymentStatus();
