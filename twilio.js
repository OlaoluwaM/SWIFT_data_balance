require('dotenv').config({ path: `${__dirname}/.env` });

const colors = require('colors');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const receivers = process.env.RECEIVER.split(',');

module.exports.sendSMS = async body => {
  const messages = await Promise.allSettled(
    receivers.map(
      async receiver =>
        await client.messages.create({
          body,
          from: process.env.SENDER,
          to: receiver,
        })
    )
  );
  receivers.forEach((receiver, ind) =>
    console.log(
      ` Message to ${colors.underline(receiver)}, ${colors.green.bold(messages[ind].status)}!`
    )
  );
};
