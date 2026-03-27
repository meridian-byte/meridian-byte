# 🧹 Cleanly Remove a Node.js App from cPanel

When deleting a Node.js app from cPanel, the UI often removes the configuration but leaves the process (`lsnode`) running in the background.
Use the following steps to fully stop and clean up the app from your account.

---

## 1. Stop and Remove via cPanel

1. Go to **cPanel → Setup Node.js App**
2. Click **Stop App**
3. Wait a few seconds, then click **Remove App**

> ⚠️ _This only removes the app definition — the background process may still be running._

---

## 2. Terminate Any Leftover Node Processes

Run this in your SSH terminal:

```bash
pkill -u $(whoami) lsnode
```

This kills any remaining `lsnode` or Node.js processes running under your user account.

Verify they’re gone:

```bash
ps -u $(whoami)
```

You should now see only your shell and the `ps` command itself — no `lsnode` entries.

---

## 3. Remove Stale Environment Files

If you’re sure you no longer need Node.js environments or apps:

```bash
rm -rf ~/nodevenv ~/app ~/tmp/passenger.spawn*
```

This clears:

- Old Node virtual environments
- App directories created by cPanel
- Passenger temp spawn files used by the NodeJS manager

---

## ✅ Final Check

Reopen your **cPanel → Resource Usage** or **Statistics** section:
Your **Number of Processes** should drop back down to normal (usually <5 for an idle account).
