**You asked for backups. Here's the setup — takes about 20 minutes, most of it is copying files.**

## Do this

**1. Turn on Time Machine (your automatic local backup)**
- Buy an external drive — any USB drive 2x the size of your MacBook's storage (if you have a 512GB Mac, get 1TB). A $50-60 drive is fine.
- Plug it in. macOS will ask "Use as backup disk?" → click **Use as Backup Disk**.
- If it doesn't ask: Apple menu → System Settings → General → Time Machine → Add Backup Disk → select the drive.
- It'll now back up everything automatically, every hour, forever, as long as the drive is plugged in.

**2. Turn on iCloud Photos (so photos are also off your laptop, automatically)**
- Apple menu → System Settings → [your name] → iCloud → Photos → turn on.
- This is not a substitute for step 1 — see Careful below.

**3. Put your freelance folder in iCloud Drive or a synced cloud folder**
- Move the folder (or just make sure it lives inside Documents/Desktop, which iCloud Drive syncs by default) so it's copied to Apple's servers, not just sitting on your laptop.
- System Settings → [your name] → iCloud → iCloud Drive → make sure "Desktop & Documents Folders" is turned on, then confirm your freelance folder is inside one of those.

**4. One setting to fix so Time Machine doesn't quietly skip your photos**
- System Settings → General → Storage → make sure "Optimize Mac Storage" (under Photos settings) is **off**, or your local photo library gets thinned out and Time Machine backs up placeholders instead of full images.

That's it. No app to learn, nothing to remember to do — both systems now run themselves.

## Careful

- **iCloud is sync, not backup.** If you delete a photo or delete the freelance folder, it deletes on iCloud too. The only thing that protects you from "I deleted it by accident" is the external drive from step 1 — Time Machine keeps old versions going back weeks/months, iCloud does not.
- **Keep the drive in a different place than the laptop, occasionally.** If your MacBook and the backup drive are stolen together or burn together, you lose both. Once a month, unplug it and leave it somewhere else (a drawer at work, a friend's house) for a day, then reconnect.
- **The drive will eventually fill up and macOS deletes the oldest backups automatically** — that's normal, not a failure.

## Check it worked

Wait a day, then: Time Machine icon in the menu bar → Enter Time Machine → pick a date from a week ago → find a photo or a file from your freelance folder → restore it. If it comes back, the backup is real, not just "looks set up."

## Decided for you

- Time Machine + iCloud over a paid service like Backblaze — because it's built into your Mac already, no signup, no monthly fee, and good enough for a solo freelancer's laptop.
- Local external drive over cloud-only backup — because a drive restores full-speed and doesn't depend on your internet if your laptop dies.
- iCloud Photos over just Time Machine for photos — because it also gives you your photos on your phone, which most people want anyway.

## Only you can decide

- Do you have $50-60 to buy a drive today, or do you want a phone-in workaround for now? (assumed: yes, buying a drive — it's the only real protection against theft/damage/deletion)
- Is your freelance work sensitive enough that you want it encrypted on the drive too? (assumed: no, standard Time Machine encryption prompt is enough — say "encrypt this backup" when it asks and set a password you'll remember)
