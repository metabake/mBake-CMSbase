

import sqlite = require('sqlite')
import SQL from 'sql-template-strings';
import axios from 'axios'  // to send a 3 char validation code
const bcrypt = require('bcryptjs') // to hash pswdws

// include in API for WebAdmin

// guid for pk client side 
// eg: bcrypt randomBytes(16).toString("hex") or base64, or Math.random to make base64 char 16 times
// also to email a random # 

export class ADB { // auth & auth DB
   // emailjs is client side api
   db

   async createNewADBwSchema(dbPath) { // the admin db is set to 'P@ssw0rd!' and you have to change it first time on DB create
      const dbPro = sqlite.open(dbPath)
      this.db = await dbPro
      this.db.configure('busyTimeout', 2 * 1000)
   }

   isUserAuth(userEmail, pswdHash) { // yes the pswds are a hash
      // run some code and:
      return 'editor'
   }
   async addAdmin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite) {
      var salt = bcrypt.genSaltSync(10);
      var hashPass = bcrypt.hashSync(password, salt);

      await this.db.run(`CREATE TABLE admin(email,password,emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite)`);
      await this.db.run(`CREATE TABLE editors(id,email,password,name,emailjsService_id, emailjsTemplate_id, emailjsUser_id)`);
      await this.db.run(`INSERT INTO admin(email, password, emailjsService_id, emailjsTemplate_id, emailjsUser_id, pathToSite) VALUES('${email}', '${hashPass}', '${emailjsService_id}', '${emailjsTemplate_id}', '${emailjsUser_id}', '${pathToSite}')`, function (err) {
         if (err) {
         }
         // get the last insert id
      });
   }

   validateEmail(email, password) {
      return this.db.get(`SELECT password FROM admin WHERE email=?`, email, function (err, row) {
         if (err) {
         }
         return row
      }).then(function (row) {
         bcrypt.compare(password, row.password, function (err, res) {
            return true
         })
      })
   }
   getEditors() {
      return this.db.all(`SELECT name, email FROM editors`, [], function (err, rows) {
         if (err) {
            console.info("--err:", err)
         }
         return rows
      })
   }


}

// module.exports = {
//    ADB
// }
