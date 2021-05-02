# SWIFT Data Balance

A script you can run in your terminal to scrape the swift networks site for your remaining data balance.
Requires the following env variables

- USERNAME
- PASSWORD

If you want to send SMS, you would need to have a Twilio account and follow their prompts and documentation.
You would need the following variables

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- SENDER
- RECEIVER

**Note:** You can have multiple receivers, just separate them using a comma
**Note:** Both the SENDER and RECEIVER are numbers with their country codes and both must be verified on Twilio before use otherwise you'll get an error.
