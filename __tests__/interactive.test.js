const { handleAdd, handleList, handleSearch, handleUpdate, handleDelete, mainMenu } = require('../interactive');  // using require
const { addContact, listContacts, searchContactByName, updateContact, deleteContact } = require('../queries/contact');
const { inquirer } = require('inquirer');
const { chalk } = require('chalk');

// Mock the database functions
jest.mock('../queries/contact');
jest.mock('inquirer');
jest.mock('chalk', () => ({
  green: jest.fn(),
  red: jest.fn(),
  blue: jest.fn(),
  yellow: jest.fn()
}));

describe('Contact Manager CLI Tests', () => {
  // Test: Handle adding a contact
  describe('handleAdd', () => {
    it('should add a new contact and log success message', async () => {
      // Setup mock behavior
      inquirer.prompt.mockResolvedValue({
        name: 'John Doe',
        phone: '1234567890',
        email: 'johndoe@example.com',
        address: '123 Main St'
      });

      addContact.mockResolvedValue(true);  // Mocking the database response

      // Run the function
      await handleAdd();

      // Verify the calls
      expect(inquirer.prompt).toHaveBeenCalled();
      expect(addContact).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '1234567890',
        email: 'johndoe@example.com',
        address: '123 Main St'
      });
      expect(chalk.green).toHaveBeenCalledWith('✅ Contact added!');
    });

    it('should log an error message when adding a contact fails', async () => {
      inquirer.prompt.mockResolvedValue({
        name: 'John Doe',
        phone: '1234567890',
        email: 'johndoe@example.com',
        address: '123 Main St'
      });

      addContact.mockRejectedValue(new Error('Database error'));

      await handleAdd();

      expect(chalk.red).toHaveBeenCalledWith('❌ Error adding contact:', 'Database error');
    });
  });

  // Test: Handle listing all contacts
  describe('handleList', () => {
    it('should list all contacts', async () => {
      // Mocking the response from the database
      listContacts.mockResolvedValue([
        { name: 'John Doe', phone_number: '1234567890', email: 'johndoe@example.com', address: '123 Main St' },
        { name: 'Jane Smith', phone_number: '0987654321', email: 'janesmith@example.com', address: '456 Oak St' }
      ]);

      await handleList();

      expect(listContacts).toHaveBeenCalled();
      expect(chalk.yellow).toHaveBeenCalledWith('👤 John Doe');
      expect(chalk.yellow).toHaveBeenCalledWith('👤 Jane Smith');
    });
  });

  // Test: Handle searching contacts by name
  describe('handleSearch', () => {
    it('should return results for a found contact', async () => {
      const name = 'John Doe';
      inquirer.prompt.mockResolvedValue({ name });

      searchContactByName.mockResolvedValue([
        { name: 'John Doe', phone_number: '1234567890', email: 'johndoe@example.com', address: '123 Main St' }
      ]);

      await handleSearch();

      expect(searchContactByName).toHaveBeenCalledWith(name);
      expect(chalk.green).toHaveBeenCalledWith('👤 John Doe');
    });

    it('should log an error when no contact is found', async () => {
      const name = 'John Doe';
      inquirer.prompt.mockResolvedValue({ name });

      searchContactByName.mockResolvedValue([]);

      await handleSearch();

      expect(chalk.red).toHaveBeenCalledWith('❌ No contact found.');
    });
  });

  // Test: Handle updating a contact
  describe('handleUpdate', () => {
    it('should update an existing contact and log success message', async () => {
      inquirer.prompt.mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({
          name: 'John Updated',
          phone: '1234567890',
          email: 'johnupdated@example.com',
          address: '789 Elm St'
        });

      updateContact.mockResolvedValue(true);

      await handleUpdate();

      expect(updateContact).toHaveBeenCalledWith({
        id: 1,
        name: 'John Updated',
        phone: '1234567890',
        email: 'johnupdated@example.com',
        address: '789 Elm St'
      });
      expect(chalk.green).toHaveBeenCalledWith('✅ Contact updated!');
    });

    it('should log an error when updating a contact fails', async () => {
      inquirer.prompt.mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({
          name: 'John Updated',
          phone: '1234567890',
          email: 'johnupdated@example.com',
          address: '789 Elm St'
        });

      updateContact.mockRejectedValue(new Error('Database error'));

      await handleUpdate();

      expect(chalk.red).toHaveBeenCalledWith('❌ Error updating contact:', 'Database error');
    });
  });

  // Test: Handle deleting a contact
  describe('handleDelete', () => {
    it('should delete a contact and log success message', async () => {
      const id = 1;
      inquirer.prompt.mockResolvedValue({ id });

      deleteContact.mockResolvedValue(true);

      await handleDelete();

      expect(deleteContact).toHaveBeenCalledWith(id);
      expect(chalk.green).toHaveBeenCalledWith('✅ Contact deleted!');
    });

    it('should log an error when deleting a contact fails', async () => {
      const id = 1;
      inquirer.prompt.mockResolvedValue({ id });

      deleteContact.mockRejectedValue(new Error('Database error'));

      await handleDelete();

      expect(chalk.red).toHaveBeenCalledWith('❌ Error deleting contact:', 'Database error');
    });
  });
});
