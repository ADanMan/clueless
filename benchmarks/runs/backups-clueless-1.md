## Do this

**Step 1 — Turn on Time Machine (this is your real backup, do it first, takes 2 minutes to start):**
1. Buy an external drive at least **2x your Mac's storage** (e.g. Mac has 512GB → get a 1TB+ drive). Any USB-C/USB-3 drive works; SSD is faster and more durable than HDD, worth the extra cost if you can.
2. Plug it into your Mac.
3. When macOS asks "Do you want to use this disk to back up with Time Machine?" → click **Use as Backup Disk**.
   - If it doesn't ask: Apple menu → System Settings → General → Time Machine → Add Backup Disk → select your drive.
4. When prompted, tick **"Encrypt Backup Disk"** — this puts a password on the drive so if it's stolen, your contracts and client data aren't readable. Write that password down somewhere that isn't only on this Mac (see Careful, below).
5. Let it run the first backup fully (can take hours depending on how much data you have — leave it plugged in overnight).
6. Leave the drive plugged in as much as possible afterward. Time Machine then backs up automatically every hour in the background — nothing more to do.

**Step 2 — Turn on iCloud Photos (so your photos also live off-device, not just on the one drive):**
1. Apple menu → System Settings → [your name] → iCloud → Photos → turn on **"Sync this Mac"**.
2. If you're asked about storage: your free iCloud tier is only 5GB, which is not enough for a real photo library. Go to iCloud storage settings and upgrade to the **200GB plan (~$2.99/month)** — safe default for a typical personal photo library; bump to 2TB (~$9.99/month) later if you shoot a lot of video.

**Step 3 — Get the freelance folder off this one Mac entirely (contracts/invoices/designs are the stuff that costs you real money and clients if lost):**
1. Put that folder inside your iCloud Drive folder (or install Dropbox/Google Drive free tier and put it there instead — either is fine, iCloud is simplest since you already turned it on).
2. Wait for the cloud icon next to the folder to show it's fully uploaded (not just "syncing").
3. This means: if your Mac is stolen, dies, or gets ransomware, that folder still exists in the cloud, separate from your Time Machine drive.

That's it — three things running in the background from now on, no further action needed unless the "Check it worked" step below fails.

## Careful

- **iCloud is sync, not backup.** If you delete a file, or ransomware encrypts it, that change also happens in iCloud — it's not protected there. Your Time Machine drive is the thing that actually saves you, because it keeps snapshots going back in time, not just a live mirror. Keep both.
- **Turn OFF "Optimize Mac Storage"** for Photos (System Settings → Apple ID → iCloud → Photos). If it's on, macOS deletes full-resolution originals from your Mac once storage is tight and keeps only iCloud copies — fine normally, but it means your Time Machine backup may only contain low-res thumbnails, not your real photos. With it off, full photos stay on your Mac and get backed up properly.
- **Write down the Time Machine drive's encryption password somewhere other than this Mac** (a physical notebook, or a password manager on your phone). If you forget it and the Mac is gone too, that backup is permanently unreadable — no recovery possible.
- **The drive itself is a single point of failure** if it sits next to your Mac and your home floods, burns, or is burgled — both are gone together. iCloud (steps 2–3) covers this for photos and the freelance folder; it does not cover the rest of your Mac (apps, settings, other files), which only the physical drive backs up.
- **Don't wait to free up space by deleting originals once "they're in iCloud."** Confirm the cloud copy first (see check below) before deleting anything locally.

## Check it worked

Pick one photo you don't mind testing with:
1. Unplug the Time Machine drive, plug it back in, open **Time Machine** from the menu bar (or Spotlight → "Time Machine") → Enter Time Machine.
2. Go back to any past date, find that one photo, and restore it to your Desktop.
3. If it restores correctly, your backup is real. If Time Machine shows no backups yet, it's still running the first one — wait and recheck in a few hours.

Separately, open icloud.com/photos and icloud.com/iclouddrive in a browser on any other device — confirm your photos and the freelance folder actually appear there, not just "syncing" forever.

## Decided for you

- **Chose Time Machine + iCloud over Backblaze or a paid backup service** — because it's built into your Mac, costs nothing beyond a one-time drive purchase plus ~$3/month for iCloud storage, and needs zero ongoing maintenance from you. A paid service like Backblaze is a reasonable upgrade later if you want offsite backup of your *entire* drive without buying external hardware, but it's a paid subscription for something the built-in tools already do well enough for a solo freelancer.
- **Chose "encrypt the Time Machine drive" over leaving it unencrypted** — because your freelance folder has client contracts and invoices on it; an unencrypted stolen drive exposes that data to whoever finds it.
- **Chose iCloud Drive over Dropbox/Google Drive for the freelance folder** — because you're already turning on iCloud Photos, so it's one less account and one less app to manage. Functionally interchangeable if you'd rather use Dropbox/Google Drive instead (e.g. if a client wants something in Dropbox).
- **Chose 200GB iCloud tier as the default** — big enough for most personal photo libraries plus documents; cheap enough not to think about.

## Only you can decide

- **Where do you keep the Time Machine drive?** Assumed: at home, next to the Mac, for convenience. If you work from a studio/office or travel a lot, keep it wherever the Mac usually is, or buy a second drive to rotate between two locations for real disaster protection.
- **Do any clients require you to NOT store their contracts in a personal iCloud/Dropbox account** (some client NDAs restrict this)? Assumed: no such restriction applies to you. If one does, tell me and we'll use an encrypted local-only folder instead for that client's files.
- **Budget: is ~$3–10/month for iCloud storage acceptable?** Assumed: yes, it's the cheapest viable option. If not, say so and I'll set up a free alternative (e.g. Google Photos free tier + Google Drive, with some tradeoffs in quality/storage limits).
