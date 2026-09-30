Here's a simple, "set it and forget it" backup setup for a Mac. This gives you two layers of protection: one backup that lives in your house (fast, free after the one-time cost) and one that lives off-site in the cloud (protects you if your laptop is lost, stolen, or your house has a fire/flood). You only have to do this once.

## Step 1: Get an external drive for local backups (Time Machine)

1. Buy an external USB or USB-C drive with at least double the storage of your MacBook (if you have a 512GB MacBook, get a 1TB+ drive). Any reputable brand (Samsung T7, SanDisk, WD, Seagate) works fine — around $60-100.
2. Plug it into your MacBook.
3. A popup will appear asking "Do you want to use this disk to back up with Time Machine?" Click **Use as Backup Disk**.
4. If the popup doesn't appear: open **System Settings → General → Time Machine → Add Backup Disk**, and select your drive.
5. Check the box for **"Encrypt Backup Disk"** if offered — this protects your freelance contracts/invoices if the drive is ever lost or stolen. Set a password you'll remember (or save it in your Mac's Keychain).
6. Click **Use Disk**. That's it — Time Machine will now automatically back up your entire Mac every hour whenever the drive is connected, and keeps daily backups for a month and weekly backups older than that.

What to do going forward: just leave the drive plugged in when you're home/working. If you unplug it to travel, plug it back in when you return — it'll catch up automatically. No further action needed.

## Step 2: Get an off-site (cloud) backup for the important stuff

Time Machine protects you from a dying hard drive, but not from your house burning down, your laptop being stolen with the drive, or ransomware. For that you want a cloud backup.

**Easiest option: iCloud Drive** (you likely already have this set up since you have a Mac).
1. Open **System Settings → [your name] → iCloud → iCloud Drive**, turn it on.
2. Turn on **Desktop & Documents Folder Sync** — this automatically uploads anything in your Desktop and Documents folders to the cloud and keeps it synced.
3. Move (or keep) your **Photos** and your **freelance work folder** inside Documents (or Desktop) so they get swept into this sync automatically.
4. For Photos specifically: open the **Photos** app → Settings → iCloud → turn on **"Sync this Mac."** This uploads your whole photo library to iCloud automatically.
5. You'll need enough iCloud storage — go to **System Settings → [your name] → iCloud → Manage** and upgrade your plan if needed. For a full photo library + documents, the 200GB plan ($2.99/month) or 2TB plan ($9.99/month) is usually enough. Pick based on how many photos/videos you have; if unsure, start with 200GB — Apple will prompt you to upgrade if you get close to full.

That's the whole cloud layer. Once turned on, it runs silently in the background forever.

## Step 3: (Optional but recommended) A second off-site copy for your freelance files specifically

Contracts and invoices are the one thing you really can't afford to lose (legal/financial value). Since iCloud already covers this in Step 2, you technically already have redundancy (Time Machine + iCloud = 2 copies in 2 places). This step is only if you want extra peace of mind:

1. Install **Dropbox** or **Google Drive** (either is fine, pick whichever you might already have an account for).
2. Drag your freelance folder into the Dropbox/Google Drive folder it creates on your Mac.
3. It will sync automatically from then on.

This is optional — skip it if Step 2 feels like enough.

## What you get after doing this once

- **Local backup**: Time Machine, automatic hourly, on your external drive — protects against a dying laptop or accidental deletion.
- **Cloud backup**: iCloud Drive + Photos sync, automatic, continuous — protects against theft, fire, or losing the laptop entirely.
- **Zero ongoing effort**: just keep the external drive plugged in occasionally (e.g., at home overnight) and leave Wi-Fi on for iCloud to sync. You never have to remember to "do a backup" — it just happens.

## The one habit worth keeping

Once every month or two, glance at **System Settings → General → Time Machine** and confirm the "Latest Backup" date isn't more than a few days old. That's the only maintenance this setup needs.
