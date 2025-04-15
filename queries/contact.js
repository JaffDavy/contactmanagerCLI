import db from '../db/index.mjs';

export async function createGroup(name) {
  const client = await db.connect();
  try {
    await client.query('INSERT INTO groups(name) VALUES($1)', [name]);
  } finally {
    client.release();
  }
}

export async function addContactToGroup(contactId, groupId) {
  const client = await db.connect();
  try {
    await client.query(
      'INSERT INTO contact_groups(contact_id, group_id) VALUES($1, $2)',
      [contactId, groupId]
    );
  } finally {
    client.release();
  }
}

export async function updateContact({ id, name, phone, email, address }) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    if (name || address) {
      await client.query(
        `UPDATE contacts SET 
          name = COALESCE($1, name), 
          address = COALESCE($2, address)
         WHERE id = $3`,
        [name, address, id]
      );
    }

    if (phone) {
      await client.query(
        `UPDATE phones SET phone_number = $1 WHERE contact_id = $2`,
        [phone, id]
      );
    }

    if (email) {
      await client.query(
        `UPDATE emails SET email = $1 WHERE contact_id = $2`,
        [email, id]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function searchContactByName(name) {
  const client = await db.connect();
  try {
    const res = await client.query(`
      SELECT 
        c.id, c.name, c.address, 
        p.phone_number, 
        e.email
      FROM contacts c
      LEFT JOIN phones p ON c.id = p.contact_id
      LEFT JOIN emails e ON c.id = e.contact_id
      WHERE LOWER(c.name) LIKE LOWER($1)
    `, [`%${name}%`]);

    return res.rows;
  } finally {
    client.release();
  }
}

export async function listContacts() {
  const client = await db.connect();
  try {
    const res = await client.query(`
      SELECT 
        c.id, c.name, c.address, 
        p.phone_number, 
        e.email
      FROM contacts c
      LEFT JOIN phones p ON c.id = p.contact_id
      LEFT JOIN emails e ON c.id = e.contact_id
    `);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function addContact({ name, phone, email, address }) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const contactRes = await client.query(
      'INSERT INTO contacts(name, address) VALUES($1, $2) RETURNING id',
      [name, address]
    );
    const contactId = contactRes.rows[0].id;

    if (phone) {
      await client.query(
        'INSERT INTO phones(contact_id, phone_number) VALUES($1, $2)',
        [contactId, phone]
      );
    }

    if (email) {
      await client.query(
        'INSERT INTO emails(contact_id, email) VALUES($1, $2)',
        [contactId, email]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteContact(id) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM contacts WHERE id = $1', [id]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
