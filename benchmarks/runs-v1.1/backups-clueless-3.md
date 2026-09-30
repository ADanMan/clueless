## Do this

**1. Turn on Time Machine (your automatic local backup) — 5 minutes**
- Buy an external drive: **2TB, USB-C or USB-A depending on your Mac** — $60–100 (2026 street price, check). Get it now, not later; everything below needs it.
- Plug it in. macOS will pop up "Do you want to use this disk to back up with Time Machine?" → click **Use as Backup Disk**.
- If it doesn't pop up: **System Settings → General → Time Machine → Add Backup Disk** → pick your drive.
- Tick **Encrypt Backup Disk**. Set a password and **write it down somewhere other than that same laptop** (e.g. your phone's notes, or paper) — if the laptop dies, that's the only place it lives.
- Leave it. It now backs up everything automatically, every hour, whenever the drive is connected.

**2. Turn off "Optimize Mac Storage" — 1 minute, do this before step 3**
- **System Settings → Apple ID (top of sidebar) → iCloud → Photos** → turn OFF "Optimize Mac Storage" (or set it to **Download Originals to this Mac**).
- Why first: with this on, macOS deletes the full-size originals off your laptop and keeps only small previews once you're low on space. If that's on, your Time Machine backups end up full of previews, not your real photos.

**3. Turn on iCloud Photos — 5 minutes (this is your off-site copy, for fire/theft/laptop-stolen-from-your-bag)**
- **System Settings → Apple ID → iCloud → Photos** → toggle **ON**.
- You likely need more iCloud storage: **200GB plan, ~$3/month, or 2TB ~$10/month (2026 pricing, check)** — pick 200GB unless your Photos library is already close to that size (Photos app → About shows the size).
- This syncs continuously once turned on; no further action.

**4. Back up the freelance folder (contracts, invoices, designs) specifically — 10 minutes**
- Put that whole folder inside **iCloud Drive** (or Desktop/Documents if you already have "Desktop & Documents Folders" synced under the same iCloud Photos toggle screen — turn that on too if it's off) so it gets the same off-site copy as your photos.
- This folder is your business's legal and financial records — it gets a second, independent copy beyond Time Machine + iCloud: turn this folder into a single zip once a week and email it to yourself, or drop it into a dedicated free Google Drive/Dropbox account (15GB free tier is plenty for documents). This matters more for this folder than for photos, because a client dispute or tax audit will ask for these specific files and "my laptop had it" is not an answer paperwork accepts.
- Rename the top-level folder something unambiguous like `Freelance_Contracts_Invoices` — it makes the weekly zip step and any future search trivial.

## Careful

- **iCloud is sync, not backup.** If you delete or a ransomware/bad app corrupts a file, that deletion/corruption propagates to every device and to iCloud itself. Time Machine is what actually protects you from "I deleted the wrong file" or "my Mac got encrypted by malware" — it keeps hourly snapshots going back weeks, so you can recover the version from before it broke.
- **"Optimize Mac Storage" must stay off**, or your local backup becomes a backup of thumbnails, not photos. Recheck this setting after any macOS update — Apple has reset it on users before.
- **Your Time Machine drive living in the same bag/house as the laptop is a single point of failure.** If your home is broken into or burns down, both the laptop and the drive are gone. iCloud (step 3) is what survives that — don't skip it thinking Time Machine alone is "done."
- **The encryption password for the Time Machine drive**, if lost, makes that entire backup permanently unreadable. Store it somewhere separate from the laptop, today.

## Check it worked

Wait about an hour after setup, then: open Photos, pick any one photo, and drag it to the Trash (yes, actually). Immediately go to **Time Machine → Enter Time Machine** (menu bar Time Machine icon, or search Spotlight for "Time Machine"), scroll back to a point before you deleted it, and restore just that one photo. If it comes back, your backup works. Then separately check iCloud: on your iPhone or iCloud.com, confirm the same photo appears there — that confirms the off-site copy is live too.

## Decided for you

- Chose **Time Machine + iCloud Photos** over a paid third-party backup service (Backblaze, etc.) because both are already built into macOS at no extra cost beyond the drive and iCloud storage you're paying for anyway, and you said you don't want to learn anything new.
- Chose a **physical external drive** over a cloud-only backup because restoring gigabytes of photos from the internet after a laptop failure can take days on a home connection; a local drive restores in hours.
- Chose **encrypting the Time Machine drive** over leaving it unencrypted because that drive will contain client contracts and invoices with names, amounts, and possibly bank details — if it's ever lost or stolen unencrypted, that's a data breach you'd have to disclose to clients.
- Chose a **separate weekly copy of the freelance folder** (beyond Time Machine/iCloud) because that folder is the one a client or tax authority might legally demand records from, and business-critical paperwork gets one more independent copy than personal photos as a matter of course.

## Only you can decide

- **Where does the Time Machine drive physically live day to day?** Assumed: at home, away from the laptop's usual commute bag, so a stolen bag doesn't take both. If you work from one fixed location and never carry the laptop elsewhere, keeping the drive right next to it is fine — say so and I'd simplify step 1.
- **Do you want the freelance folder's weekly zip emailed to yourself, or in a separate cloud account?** Assumed: whichever is less friction for you (email to yourself) — if you'd rather I set up a free Dropbox/Google Drive specifically for business files (cleaner for eventually sharing with an accountant), that's a five-minute change.
- **How much is currently in your Photos library and freelance folder, in GB?** Assumed it fits in 200GB iCloud + 2TB drive — if your Photos library alone is already over 150GB, tell me and I'd bump the iCloud plan to 2TB now instead of hitting a "storage full" wall later.
