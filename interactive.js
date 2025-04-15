import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  addContact,
  listContacts,
  searchContactByName,
  updateContact,
  deleteContact
} from './queries/contact.js';

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '📇 What would you like to do?',
      choices: [
        'Add Contact',
        'List All Contacts',
        'Search by Name',
        'Update Contact',
        'Delete Contact',
        'Exit'
      ],
    },
  ]);

  switch (action) {
    case 'Add Contact':
      await handleAdd();
      break;
    case 'List All Contacts':
      await handleList();
      break;
    case 'Search by Name':
      await handleSearch();
      break;
    case 'Update Contact':
      await handleUpdate();
      break;
    case 'Delete Contact':
      await handleDelete();
      break;
    case 'Exit':
      console.log(chalk.blue('👋 Bye!'));
      process.exit(0);
  }

  await mainMenu(); // show menu again
}

async function handleAdd() {
  const answers = await inquirer.prompt([
    { 
      name: 'name', 
      message: 'Full name:', 
      validate: (input) => input.trim() !== '' || 'Name cannot be empty.' 
    },
    { 
      name: 'phone', 
      message: 'Phone number:', 
      validate: (input) => /^\d{7,15}$/.test(input) || 'Phone number must be 7-15 digits.' 
    },
    { 
      name: 'email', 
      message: 'Email address:', 
      validate: (input) => /^\S+@\S+\.\S+$/.test(input) || 'Enter a valid email address.' 
    },
    { 
      name: 'address', 
      message: 'Address:', 
      validate: (input) => input.trim() !== '' || 'Address cannot be empty.' 
    }
  ]);

  try {
    await addContact(answers);
    console.log(chalk.green('✅ Contact added!'));
  } catch (err) {
    console.error(chalk.red('❌ Error adding contact:'), err.message);
  }
}

async function handleList() {
  const contacts = await listContacts();
  contacts.forEach((c) => {
    console.log(chalk.yellow(`👤 ${c.name}`));
    console.log(`📞 ${c.phone_number || 'N/A'}`);
    console.log(`📧 ${c.email || 'N/A'}`);
    console.log(`🏠 ${c.address || 'N/A'}`);
    console.log('--------------------');
  });
}

async function handleSearch() {
  const { name } = await inquirer.prompt([
    { name: 'name', message: 'Search name:' },
  ]);

  const results = await searchContactByName(name);
  if (results.length === 0) {
    console.log(chalk.red('❌ No contact found.'));
  } else {
    results.forEach((c) => {
      console.log(chalk.green(`👤 ${c.name}`));
      console.log(`📞 ${c.phone_number}`);
      console.log(`📧 ${c.email}`);
      console.log(`🏠 ${c.address}`);
      console.log('------------------');
    });
  }
}

async function handleUpdate() {
  const { id } = await inquirer.prompt([
    { name: 'id', message: 'Contact ID to update:' },
  ]);

  const updates = await inquirer.prompt([
    { name: 'name', message: 'New name (leave blank to keep):' },
    { name: 'phone', message: 'New phone (leave blank to keep):' },
    { name: 'email', message: 'New email (leave blank to keep):' },
    { name: 'address', message: 'New address (leave blank to keep):' },
  ]);

  try {
    await updateContact({ id, ...updates });
    console.log(chalk.green('✅ Contact updated!'));
  } catch (err) {
    console.error(chalk.red('❌ Error updating contact:'), err.message);
  }
}

async function handleDelete() {
  const { id } = await inquirer.prompt([
    { name: 'id', message: 'Contact ID to delete:' },
  ]);

  try {
    await deleteContact(id);
    console.log(chalk.green('✅ Contact deleted!'));
  } catch (err) {
    console.error(chalk.red('❌ Error deleting contact:'), err.message);
  }
}

mainMenu();
