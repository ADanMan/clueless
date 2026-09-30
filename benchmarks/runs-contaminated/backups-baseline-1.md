**Do this**

1. **Turn on iCloud Photos** (keeps all your photos backed up automatically, off your laptop's limited storage):
   - Apple menu → System Settings → your name (top) → iCloud → Photos → toggle on "Sync this Mac"

2. **Turn on iCloud Drive and keep your freelance folder inside it** (auto-backs-up + syncs contracts/invoices/designs):
   - Same iCloud settings screen → iCloud Drive → toggle on
   - Move your freelance folder into `~/Library/Mobile Documents/com~apple~CloudDocs/` — easiest way: open Finder → iCloud Drive in the sidebar → drag your freelance folder in there. It'll still show up normally, just synced now.

3. **Buy a cheap external USB/Thunderbolt drive (1TB is plenty, ~$50–60) and set up Time Machine** — this is your *real* backup, the thing that saves you if your Mac dies, gets stolen, or you delete something by accident:
   - Plug the drive in → a popup will ask "Use as backup disk?" → click **Encrypt Backup Disk** → click **Use as Backup Disk**
   - Set an encryption password and **save it somewhere other than the drive itself** (a password manager, or written down) — if you lose it, the backup is unrecoverable
   - System Settings → General → Time Machine → make sure "Back Up Automatically" is on

4. **Turn off "Optimize Mac Storage"** for iCloud Photos (Settings → iCloud → Photos) so Time Machine backs up full-resolution originals, not just thumbnails. This is easy to miss and quietly ruins the backup, so do it now, not later.

**Careful**

- **iCloud is sync, not backup.** If you delete a photo or file, it deletes everywhere (including iCloud) within ~30 days permanently. The Time Machine drive is your actual protection against "I deleted it by accident" or "my Mac got stolen/ransomwared." Don't treat iCloud alone as "I'm backed up."
- **Keep the Time Machine drive physically separate some of the time** — if it's always plugged in and your house floods/burns/gets robbed, you lose original + backup together. Once a week, unplug it and put it in a bag/drawer elsewhere, or leave it connected if that tradeoff doesn't worry you.
- **The encryption password is not recoverable by Apple.** Store it properly or you'll have a useless encrypted brick.

**Check it worked**

Wait for the first Time Machine backup to finish (menu bar clock icon → Time Machine → shows progress), then: open Time Machine from the menu bar → "Enter Time Machine" → find any one photo or file from before you started → restore it → confirm it opens correctly. That proves the whole chain works, not just that a backup icon is green.

**Decided for you**

- Chose Time Machine + iCloud over paid third-party tools (Backblaze, Carbon Copy Cloner) because it's built into macOS, free (aside from the drive), and needs zero maintenance.
- Chose an external drive over cloud-only backup because your freelance contracts/invoices need a copy that isn't dependent on your Apple account staying accessible (password issues, account locks, billing lapses).
- Chose to sync the freelance folder through iCloud Drive (not just back it up) so you also get automatic version history and access from your phone.

**Only you can decide**

- Do you want the backup drive to live at home or somewhere else (office, a relative's house) for extra protection against fire/theft? *Assumed: home, next to your laptop, for now.*
- Do you have enough iCloud storage for all your photos (free tier is only 5GB)? If not, you'll need iCloud+ (200GB is ~$3/month). *Assumed you're fine paying that if prompted — check Settings → iCloud storage bar after step 1.*
