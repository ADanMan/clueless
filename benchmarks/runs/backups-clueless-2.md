You asked for backups; what you actually want is to never lose the freelance folder (contracts/invoices/designs = your income and your legal proof), and that has a second failure mode plain backups don't fully cover — ransomware or a locked/stolen Apple ID can wipe your only backup too if it's just one copy in one place. So here's a setup that covers both: one backup that's always running automatically, and one that's physically separate so nothing can take out both at once.

## Do this

**1. Turn on iCloud Photos (covers your photos, off-site automatically)**
- Apple menu → System Settings → your name (top) → iCloud → Photos → turn on "Sync this Mac"
- If storage is full, buy the 200GB plan (~$2.99/mo) when prompted — don't use "Optimize Mac Storage" for this purpose, it only saves local disk space, it doesn't back up anything extra.

**2. Buy a cheap external SSD (this is your real backup, not iCloud)**
- Any 1TB+ USB-C SSD (Samsung T7, SanDisk Extreme) — around $60-80. Get this before doing anything else; everything below depends on it.

**3. Set up Time Machine to that drive**
- Plug the drive in. A popup will ask "Use as backup disk?" → click "Encrypt Backup Disk" → set a password you'll remember (write it down somewhere other than the Mac itself) → "Use as Backup Disk"
- If no popup: System Settings → General → Time Machine → Add Backup Disk → select your drive → check "Encrypt"

**4. Turn OFF "Optimize Mac Storage" for iCloud Drive**
- System Settings → iCloud → iCloud Drive → uncheck "Optimize Mac Storage"
- Without this, Apple silently deletes local copies of files to save space once cloud storage is low, leaving you dependent on network access to see your own files. Doing this now avoids a surprise later.

**5. Put the freelance folder in a place that's actually covered**
- Move it into iCloud Drive or your Documents folder (both get backed up by Time Machine by default; Desktop/Documents also sync to iCloud automatically once iCloud Drive is on — check System Settings → iCloud → iCloud Drive → "Desktop & Documents Folders" is on).

**6. Let it run once, unattended**
- Leave the drive connected overnight. First backup can take hours depending on how much data you have. After that it backs up automatically every hour whenever the drive is plugged in — you don't touch it again.

**7. Unplug the drive and store it somewhere NOT next to the Mac**
- A drawer at a different location, or give it to family/at work. If it sits next to your laptop, a fire, flood, or theft takes both at once.

## Careful

- **iCloud is sync, not backup.** Delete a photo on your phone, it's gone from the Mac too within seconds. The Time Machine drive is your actual safety net — don't skip it thinking iCloud alone is enough.
- **"Optimize Mac Storage" being on defeats your local files silently** — it's easy to leave on by default and not notice until you're offline and a file won't open. Turned off in step 4.
- **If the drive never gets reconnected, you have zero backup and won't know it.** Time Machine only backs up while plugged in. Plug it in at least once a week (e.g., every Sunday) — put a recurring reminder on your phone now.
- **Ransomware/malware can encrypt files on a drive that's permanently connected.** Because you're unplugging it and storing it elsewhere (step 7), this is already handled — just don't leave it plugged in 24/7 long-term.

## Check it worked

Wait for the first backup to finish (menu bar clock icon showing Time Machine progress, or check System Settings → General → Time Machine — it'll show "Latest backup: [today's date/time]"). Then: open Finder, find any one file in your freelance folder, and use Time Machine's "Browse other backup disks" (or the Time Machine app) to confirm that exact file appears in the backup. If it's there, it works.

## Decided for you

- Chose **Time Machine + iCloud** over a paid service like Backblaze — it's built into macOS (no extra software, no subscription beyond the iCloud storage tier), and gives you both local (fast to restore) and cloud (off-site) coverage.
- Chose an **external SSD** over an HDD — a bit pricier but faster, smaller, and more durable if it gets bumped around or stored somewhere with temperature swings.
- Chose to **encrypt** the Time Machine drive — if it's ever lost or stolen, your contracts and invoices (client names, payment info) aren't readable by whoever finds it.
- Chose **manual weekly reconnect** over a permanently-plugged-in drive — slightly less convenient, but it's what protects you from ransomware encrypting your backup along with your Mac.

## Only you can decide

- **Where will you store the drive when unplugged?** Assumed: somewhere physically separate from where the Mac usually sits (different room, or off-site). If you have nowhere else, at minimum keep it in a different room.
- **Is $3/month for iCloud storage acceptable, or do you want a free-only setup?** Assumed yes, it's cheap and removes one manual step (photo backup is automatic and off-site). If you want zero subscription cost, skip iCloud Photos and rely on Time Machine alone, but then your only backup is the one drive — riskier.
- **Do you want a second off-site copy of just the freelance folder** (e.g. automatically synced to a cloud drive) for extra safety against fire/theft of both the Mac and the backup drive at once? Assumed not needed given iCloud already covers photos off-site and the External-drive-stored-elsewhere plan covers everything else — but if that folder is critical to your income, consider also enabling iCloud Drive sync for it specifically, which doesn't cost anything extra with your Documents folder already synced in step 5.
