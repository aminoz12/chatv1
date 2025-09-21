# Step-by-Step Guide to Fix Google Apps Script 401 Unauthorized Error

Follow these exact steps to fix the permissions issue that's causing the 401 error.

## Step 1: Access Your Google Apps Script

1. Open your browser and go to [script.google.com](https://script.google.com)
2. Sign in with the Google account you used to create the script
3. Find and open your existing project (it should be named something like "ProjectUntitled")

## Step 2: Access Deployment Settings

1. In the Apps Script editor, look for the "Deploy" button in the toolbar (it looks like a clock icon)
2. Click on "Deploy" → "Manage deployments"
3. You should see your current deployment listed

## Step 3: Edit Your Deployment

1. Click the pencil icon (edit) next to your deployment
2. In the deployment settings window that appears:
   - Leave the "Description" as is or change it if you want
   - Make sure "Execute as" is set to "Me"
   - **This is the critical step**: Change "Who has access" from whatever it's currently set to, to **"Anyone"**
3. Click the "Deploy" button to save your changes

## Step 4: Copy the New Web App URL (Important!)

1. After clicking "Deploy", you'll see a dialog with your Web App URL
2. Copy this URL (it might be the same as before, but it's good to make sure)
3. Update your [.env](file:///c%3A/Users/pc/Desktop/botcalls/.env) file with this URL if it's different:
   ```
   APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec
   ```

## Step 5: Verify the Fix

1. Save your [.env](file:///c%3A/Users/pc/Desktop/botcalls/.env) file if you changed the URL
2. Run the debug script to test:
   ```bash
   node debug-apps-script.js
   ```
3. You should now see a 200 response instead of 401

## Common Mistakes to Avoid

### Mistake 1: Not Actually Clicking "Deploy"
- After changing "Who has access" to "Anyone", you must click the "Deploy" button
- Just changing the setting and closing the window won't save it

### Mistake 2: Choosing "Anyone with Google" Instead of "Anyone"
- "Anyone with Google" still requires authentication
- "Anyone" allows unauthenticated POST requests

### Mistake 3: Not Updating the URL
- Sometimes redeploying generates a new URL
- Always copy and verify the URL after redeploying

## If You're Still Getting 401 Errors

### Option 1: Create a New Deployment

1. In the "Manage deployments" window, click the "+" button to create a new deployment
2. Set the same settings:
   - Description: Call Data Storage
   - Execute as: Me
   - Who has access: **Anyone**
3. Click "Deploy"
4. Copy the new URL and update your [.env](file:///c%3A/Users/pc/Desktop/botcalls/.env) file

### Option 2: Check Your Google Account Settings

1. Make sure your Google account isn't blocking API access
2. Check if your account has any restrictions that might prevent web app deployments

### Option 3: Verify Your Apps Script Code

Make sure your code includes the doPost function:

```javascript
function doPost(e) {
  // Your code here
}
```

## Testing After Fix

Once you've fixed the permissions:

1. Run the debug script:
   ```bash
   node debug-apps-script.js
   ```
   You should see: "SUCCESS: Apps Script is accessible and responding!"

2. Run the complete end-to-end test:
   ```bash
   node complete-end-to-end-test.js
   ```

3. Check your Google Sheet - data should now appear!

## Still Having Issues?

If you're still experiencing problems after following these steps:

1. **Share your Apps Script URL** (the one in your [.env](file:///c%3A/Users/pc/Desktop/botcalls/.env) file)
2. **Check the Apps Script Execution Logs**:
   - In the Apps Script editor, click "Executions" in the left sidebar
   - Look for any failed executions
3. **Verify your Google Sheet permissions**:
   - Make sure the Google account that owns the script can edit the spreadsheet