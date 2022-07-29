This project is based on [Vonage Video Blueprint project by GenesysCloudBlueprints](https://github.com/GenesysCloudBlueprints/vonage-video-blueprint)

---

# Deployment to Neru

Deploying to Neru is straightforward and easy.
1. Follow [these instructions (step 1-6)](https://vonage-neru.herokuapp.com/neru/getting-started) to get started and initialize your Neru app.
2. Copy the codes in this repository over to the Neru project.
3. Replace the contents inside `neru.yml` with the contents inside `neru.yml.example` file, except for the `project.name`, `instance.region` and `instance.application-id`

| Field Name                                      | Required | Description                                                                                                                      |
|-------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------|
| appURI                                          | Yes      | This should be your Neru app's second url.<br />e.g. https://neru-12345678-sample-app-dev.apse1.serverless.vonage.com/                 |
| vonage.apiKey<br />vonage.apiSecret                  | Yes      | Vonage application credentials                                                                                                   |
| genesysCloud.region                             | Yes      | Genesys Cloud region.<br />eg. 'mypurecloud.ie', 'euw2.pure.cloud', 'usw2.pure.cloud', etc...                                          |
| genesysCloud.implicitGrantID                    | Yes      | Implicit Grant Client ID Used by the web app itself in authorizing the Genesys Cloud agent                                       |
| genesysCloud.clientID<br />genesysCloud.clientSecret | Yes      | Client Credentials OAuth For authorizing the server app                                                                          |
| genesysCloud.emailQueueID                       | No       | Required when sending invitation through email, the outbound email will go through this ACD queue.                               |
| genesysCloud.smsFromAddress                     | No       | Required when sending invitation through SMS. This number should be purchased by the Genesys Cloud organization.<br />eg +13175550000 |

4. Run `neru deploy` to deploy the app instance.
5. You can check if the app is up and running by going to the `/up` endpoint of both of the urls displayed after neru-cli successfully deployed your app.
6. Set up Genesys Cloud side, and test in Genesys interface to make sure everything is running.

---

# Deployment Guide for Vonage Video on Genesys Cloud
> View the full [Vonage Video Blueprint article](https://developer.mypurecloud.com/blueprints/vonage-video-blueprint/) on the Genesys Cloud Developer Center.

> Important Note: instead of localhost, you can use Neru's second url (the one you put under `appURI` in the `neru.yml` file) as the url host in the guide above.