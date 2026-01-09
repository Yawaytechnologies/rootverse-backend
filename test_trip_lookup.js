const knex = require('knex');
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.db'
  },
  useNullAsDefault: true
});

async function test() {
  try {
    // Get a QR with trip_id null
    const qr = await db('qrs').where({ trip_id: null }).first();
    console.log('QR:', qr);

    if (qr && qr.owner_id) {
      const owner = await db('rootverse_users').where({ id: qr.owner_id }).first();
      console.log('Owner:', owner);

      if (owner && qr.date) {
        const trips = await db('trip_plans')
          .where('owner_code', owner.owner_id)
          .select('*');
        console.log('Trips for owner:', trips);

        // Check date comparison
        const qrDate = new Date(qr.date).toISOString().split('T')[0];
        console.log('QR date (YYYY-MM-DD):', qrDate);

        for (const trip of trips) {
          const tripDate = new Date(trip.planned_at).toISOString().split('T')[0];
          console.log('Trip planned_at (YYYY-MM-DD):', tripDate);
          console.log('Dates match:', qrDate === tripDate);
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    db.destroy();
  }
}

test();
