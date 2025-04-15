import { Command } from 'commander';
import { addContact, updateContact } from './queries/contact.js';
import { listContacts } from './queries/contact.js';
import { searchContactByName } from './queries/contact.js';
import { createGroup } from './queries/contact.js';
import { addContactToGroup } from './queries/contact.js';
import chalk from 'chalk';
import db from './db/index.mjs';

const program = new Command();

program
  .command('create-group')
  .description('Create a new contact group')
  .requiredOption('--name <name>', 'Group name')
  .action(async (options) => {
    try {
      await createGroup(options.name);
      console.log(chalk.green('✅ Group created successfully.'));
    } catch (err) {
      console.error(chalk.red('❌ Error creating group:'), err.message);
    }
  });

program
  .command('add-to-group')
  .description('Add contact to a group')
  .requiredOption('--contact-id <contactId>', 'Contact ID')
  .requiredOption('--group-id <groupId>', 'Group ID')
  .action(async (options) => {
    try {
      await addContactToGroup(options.contactId, options.groupId);
      console.log(chalk.green('✅ Contact added to group.'));
    } catch (err) {
      console.error(chalk.red('❌ Error adding contact to group:'), err.message);
    }
  });


program
  .command('update')
  .description('Update a contact')
  .requiredOption('--id <id>', 'Contact ID')
  .option('--name <name>', 'New name')
  .option('--phone <phone>', 'New phone')
  .option('--email <email>', 'New email')
  .option('--address <address>', 'New address')
  .action(async (options) => {
    try {
      await updateContact(options);
      console.log(chalk.green('✅ Contact updated successfully.'));
    } catch (err) {
      console.error(chalk.red('❌ Error updating contact:'), err.message);
    }
  });

program
  .command('search')
  .description('Search contact by name')
  .requiredOption('--name <name>', 'Name to search')
  .action(async (options) => {
    try {
      const results = await searchContactByName(options.name);
      if (results.length === 0) {
        console.log(chalk.yellow('⚠️ No contact found.'));
      } else {
        results.forEach((contact) => {
          console.log(chalk.green(`👤 ${contact.name}`));
          console.log(`📞 ${contact.phone_number}`);
          console.log(`📧 ${contact.email}`);
          console.log(`🏠 ${contact.address}`);
          console.log('-------------------');
        });
      }
    } catch (err) {
      console.error(chalk.red('❌ Error searching contact:'), err.message);
    }
  });

program
  .command('list')
  .description('List all contacts')
  .action(async () => {
    try {
      const contacts = await listContacts();
      contacts.forEach((contact) => {
        console.log(chalk.blue(`📇 ${contact.name}`));
        console.log(`📞 ${contact.phone_number || 'N/A'}`);
        console.log(`📧 ${contact.email || 'N/A'}`);
        console.log(`🏠 ${contact.address || 'N/A'}`);
        console.log('--------------------------');
      });
    } catch (err) {
      console.error(chalk.red('❌ Error listing contacts:'), err.message);
    }
  });


program
  .command('delete')
  .description('Delete a contact')
  .requiredOption('--id <id>', 'Contact ID')
  .action(async (options) => {
    try {
      await deleteContact(options.id);
      console.log(chalk.green('✅ Contact deleted successfully.'));
    } catch (err) {
      console.error(chalk.red('❌ Error deleting contact:'), err.message);
    }
  });

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

program
  .name('contact-book')
  .description('A simple CLI contact book')
  .version('1.0.0');

program
  .command('add')
  .description('Add a new contact')
  .requiredOption('--name <name>', 'Full name')
  .option('--phone <phone>', 'Phone number')
  .option('--email <email>', 'Email address')
  .option('--address <address>', 'Address')
  .action(async (options) => {
    try {
      await addContact(options);
      console.log(chalk.green('✅ Contact added successfully.'));
    } catch (err) {
      console.error(chalk.red('❌ Error adding contact:'), err.message);
    }
  });

program.parse();
