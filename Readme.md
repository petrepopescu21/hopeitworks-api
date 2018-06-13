# Requirements

Add two Environment Variables:
-   `IMAGE_STORAGE` with its value set to an Azure Blob Storage connection string.
-   `LOGIC_APP_TRIGGER` poiting to your Logic App Trigger URL
-   
Locally, create a .env file in the root of your project and add:

```
IMAGE_STORAGE=<yourconnectionstirng>
LOGIC_APP_TRIGGER=<yourtriggerurl>
```