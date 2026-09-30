# Do this

Set up two backups running side by side. One lives in the cloud (protects you if your laptop is stolen, dies, or gets ransomware). One lives on a physical drive at home (protects you if iCloud has an outage, your account gets locked, or you accidentally delete something everywhere at once).

## 1. Turn on iCloud Photos (so your photos are safe first, right now)

1. Apple menu → System Settings → click your name at the top → iCloud → Photos → turn on "Sync this Mac."
2. Still in iCloud settings, click "iCloud Drive" and make sure it's on.
3. Go back to the main iCloud screen → Manage → if you're near your storage limit, upgrade to 200GB (~$2.99/month) or 2TB (~$9.99/month) now. Don't wait until it's full — uploads silently stop when storage is full and you won't get a loud warning.

This alone protects your photos going forward. It does **not** protect your freelance folder unless that folder lives inside iCloud Drive — move it there:

4. Open Finder → drag your freelance work folder into iCloud Drive (in Finder's sidebar). Wait for the cloud icon next to it to turn into a plain folder icon — that means it's fully uploaded (can take a few hours for a big folder, leave the laptop open and on Wi-Fi).

## 2. Buy a drive and turn on Time Machine (your real backup)

1. Buy any USB-C or Thunderbolt external SSD, 1TB minimum (roughly 2x whatever's currently on your Mac). ~$70-90 for 1TB. Don't buy an HDD — slower, more failure-prone, not worth the small savings.
2. Plug it into your Mac. A popup will ask "Do you want to use this disk to back up with Time Machine?" → click "Use as Backup Disk" → click "Encrypt Backup Disk" → set a password → **write that password down somewhere that is not only on this Mac** (a physical note, or your phone's notes app). If you lose it, the entire backup becomes unreadable, forever.
3. First backup starts automatically and can take a few hours. After that it backs up every hour automatically whenever the drive is plugged in, no action from you.
4. Keep the drive plugged in most of the time (or at least plug it in once a week) so backups actually happen.

## 3. One setting that quietly breaks this if you skip it

System Settings → General → Storage → click the "i" next to your storage bar → make sure **"Optimize Mac Storage" is OFF** for both iCloud Photos and Time Machine won't be affected, but if you ever turned on "Optimize Mac Storage" for Photos specifically, your Mac keeps only small thumbnails locally and the full-resolution originals live only in iCloud — meaning your Time Machine backup would only be backing up thumbnails, not your real photos. Keep full-resolution originals downloaded: Settings → Apple ID → iCloud → Photos → select "Download Originals to this Mac."

# Careful

- **iCloud is sync, not backup.** If you delete a photo (even by accident) or a file in the freelance folder, it deletes from iCloud and every other device too, within minutes. It is not a safety net against deletion — only the Time Machine drive is. (iCloud does keep a "Recently Deleted" folder for ~30 days for Photos, but don't rely on that as your real backup.)
- **The Time Machine drive is a single point of failure if it lives next to your laptop.** If your apartment floods, burns, or gets robbed, laptop and backup drive go together. Ultra note below covers this.
- **The encryption password for the Time Machine drive is unrecoverable if lost.** Write it down physically, not just in a password manager on the same laptop.
- **"Optimize Mac Storage"** — see step 3 above. This is the single most common way people think they have backups and don't.

# Check it worked

Wait 24 hours after setup, then:
1. Unplug the Time Machine drive, plug it back in, open Time Machine (Spotlight search "Time Machine") → you should see backups stacked going back in time, most recent within the last hour.
2. Pick one random photo you don't mind testing with, delete it from your Photos app, then use Time Machine to restore it from yesterday's backup. If it comes back, the whole chain works.
3. Open iCloud.com in a browser (not on this Mac) and confirm your freelance folder and recent photos show up there too.

If either check fails, backups are not actually happening — don't wait for a crisis to find out.

# Decided for you

- Chose Time Machine + iCloud over a paid service like Backblaze — because it's built into your Mac already, no extra software, no extra monthly account to manage, and it covers both "accidental deletion" and "laptop died" failure modes. Backblaze is a fine alternative if you'd rather have fully automatic offsite backup and don't want to buy a drive — say so and I'll walk you through that instead.
- Chose an external SSD over HDD — faster, more durable, small price difference at 1TB.
- Chose to encrypt the Time Machine drive — if the drive itself is ever lost or stolen, your freelance client contracts and invoices aren't just sitting there readable.
- Chose iCloud Drive (not Dropbox/Google Drive) for the freelance folder — it's already paid for as part of your Apple ID and needs zero extra setup, since you said you don't want to learn anything new.

# Only you can decide

- **Where do you keep the Time Machine drive?** Assumed: at home, near the laptop, for convenience. If you want real disaster protection (fire, theft, flood), keep it at a different location (office, family member's place) and swap it in occasionally — tell me and I'll adjust the plan, or add Backblaze as a third, fully offsite copy.
- **Your iCloud storage tier** — assumed 200GB ($2.99/mo) is enough; if your photo library is large (10,000+ photos or lots of video) you may need 2TB ($9.99/mo). Check System Settings → iCloud → Manage after the first sync to see how close you are.
- **How sensitive are the freelance contracts?** If any of them are under NDA requiring specific data-handling terms, plain iCloud storage may not satisfy that contractually — you'd know, I wouldn't. Flag it if so and we can look at a business-grade option instead.
