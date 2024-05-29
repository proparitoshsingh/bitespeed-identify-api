const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.post("/identify", async (req, res) => {
   const { email, phoneNumber } = req.body;
   try {
      const finder = await pool.query(
         "SELECT * FROM Contact WHERE email=$1 OR phoneNumber=$2;",
         [email, phoneNumber]
      );
      const contacts = result.rows;
      if(contacts.rows===0){
         const newContact=await pool.query(
            "INSERT INTO Contact (email, phoneNumber, linkPrecedence, createdAt, updatedAt) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *;",
            [email, phoneNumber, 'primary']
         );
         const primaryContact=newContact.rows[0];
         return res.status(200).json({
            contact:{
               primaryContactId: primaryContact.id,
               emails:[primaryContact.email],
               phoneNumbers:[primaryContact.email],
               secondaryContactIds:[]
            }
         });
      }
      let primaryContact=contacts.find(contact=> contact.linkPrecedence ==="primary");
      if(!primaryContact){
         primaryContact=contacts[0];
      }
      const secondaryContacts=contacts.filter(contact=>contact.linkPrecedence==="secondary");
      const emails=[primaryContact.email,...new Set(contacts.map(contact=>contact.email).filter(email=>email !== primaryContact.email))];
      const phoneNumbers=[primaryContact.phoneNumber,...new Set(contacts.map(contact=>contact.phoneNumber).filter(phoneNumber=>phoneNumber !==primaryContact.phoneNumber))];
      const secondaryContactIds=secondaryContacts.map(contact=>contact.id);

      if(contacts.some(contact=>contact.email ===email && contact.phoneNumber ===phoneNumber)){
         return res.status(200).json({
            contact:{
               primaryContactId:primaryContact.id,
               emails,
               phoneNumbers,
               secondaryContactIds
            }
         });
      }

      const newSecondaryContact=await pool.query(
         "INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *;",
         [email, phoneNumber, primaryContact.id, 'secondary']
      );

      res.json({
         contact:{
            primaryContactId:primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds
         }
      });

   } catch (error) {
      res.status(500).json({error:"Some internal server error occured"});
   }
})


app.listen(port, () => {
   console.log('Server running at port', port);
})