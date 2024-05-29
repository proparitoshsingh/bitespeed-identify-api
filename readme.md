# Identify Service

This is a web service designed to identify and consolidate customer contacts. The service receives HTTP POST requests with JSON payloads containing an email and/or phone number and returns a consolidated contact.

## Features

- Consolidates customer contacts based on email and phone number.
- Supports creating new primary contacts.
- Links secondary contacts to primary contacts when new information is provided.
- Provides a unified response containing all related emails, phone numbers, and secondary contact IDs.

## Technologies Used

- Node.js
- Express
- PostgreSQL
- dotenv
- cors

## API Endpoints

### Identify Contact

#### URL

`/identify`

#### Method

`POST`

#### Request Body

The request should contain either `email`, `phoneNumber`, or both:

```json
{
  "email": "string",
  "phoneNumber": "number"
}
```

#### Response

The service returns an HTTP response with a JSON payload containing the consolidated contact:

```json
{
  "contact": {
    "primaryContactId": number,
    "emails": ["string"],
    "phoneNumbers": ["string"],
    "secondaryContactIds": [number]
  }
}
```
### Example

#### Request

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

### Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Database Schema

The service uses the following PostgreSQL schema:

### Contacts Table

| Column         | Type      | Constraints                     |
|----------------|-----------|---------------------------------|
| id             | SERIAL    | PRIMARY KEY                     |
| phoneNumber    | VARCHAR   | NOT NULL                        |
| email          | VARCHAR   | NOT NULL                        |
| linkedId       | INTEGER   | REFERENCES Contacts(id)         |
| linkPrecedence | VARCHAR   | CHECK (linkPrecedence IN ('primary', 'secondary')) |
| createdAt      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP       |
| updatedAt      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP       |
| deletedAt      | TIMESTAMP | NULL                            |




#### Installation
Clone the repository:

```
git clone https://github.com/proparitoshsingh/bitespeed-identify-api.git
cd bitespeed-identify-api
```

Install dependencies:

```
npm install
```

Set up environment variables:

Create a .env file in the root of the project and add the port number you want the server to run on:

```
PORT=3000
```

Run the database migrations:
```bash
# Create tables in PostgreSQL locally
psql -U yourusername -d yourdatabase -a -f database.sql
```

Start the development server:
```bash
npm run dev 
```
Or the normal server :
```bash
npm start
```
<br><br><br>

<center>--- Paritosh Singh ---</center>