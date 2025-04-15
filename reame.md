Contact Manager CLI
A command-line interface (CLI) tool for managing contacts, built with Node.js. This tool allows users to add, list, search, update, and delete contacts interactively using the terminal. It also supports categorizing contacts into different groups.

Features
Add Contact: Add new contacts with full name, phone number, email, and address.

List All Contacts: View a list of all your contacts in the terminal.

Search by Name: Search for a contact by their name.

Update Contact: Update contact information such as name, phone number, email, and address.

Delete Contact: Delete a contact by their unique ID.

Categorize Contacts: Assign contacts to specific groups (e.g., family, friends, colleagues).

Installation
Prerequisites
Node.js (v14.x or higher)

npm (Node package manager)

Steps
Clone the repository:

bash
Copy
Edit
git clone https://github.com/JaffDavy/contact-managerCLI.git
Navigate to the project directory:

bash
Copy
Edit
cd contact-managerCLI
Install the dependencies:

bash
Copy
Edit
npm install
Set up your database connection (you might need to configure your environment variables depending on your setup).

Usage
Once you've set up the project, you can start the interactive CLI by running:

bash
Copy
Edit
node interactive.js
This will launch a terminal-based menu where you can choose what action to take. The available options are:

Add Contact: Add a new contact to your contact list.

List All Contacts: View all your saved contacts.

Search by Name: Search for a contact by name.

Update Contact: Update information for an existing contact.

Delete Contact: Delete an existing contact.

Exit: Exit the application.

Testing
To test the application, you can run the tests with:

bash
Copy
Edit
npm test
Ensure that Jest is properly configured in your project to handle ECMAScript modules (ESM) or CommonJS modules.

Example Commands
Add a Contact:

yaml
Copy
Edit
Add Contact
Full name: John Doe
Phone number: 123-456-7890
Email: john.doe@example.com
Address: 1234 Elm Street
Search for a Contact by Name:

pgsql
Copy
Edit
Search by Name: John
Update a Contact:

pgsql
Copy
Edit
Update Contact ID: 1
New name (leave blank to keep): Jane Doe
New phone (leave blank to keep): 987-654-3210
Delete a Contact:

sql
Copy
Edit
Delete Contact ID: 1
Contributing
Contributions are welcome! Feel free to fork the repository, make improvements, and submit pull requests. If you have any ideas for new features or improvements, create an issue or submit a PR.

License
This project is licensed under the MIT License - see the LICENSE file for details.

