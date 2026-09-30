## Do this

**Step 1 — Turn on Time Machine (your automatic, ongoing backup):**
1. Buy an external SSD, at least 2x the size of your MacBook's used storage (check in Apple menu → About This Mac → Storage). For most people: a 1TB–2TB USB-C SSD, $60–130 (2026 street price, check).
2. Plug it into your Mac.
3. When macOS asks "Do you want to use this disk to back up with Time Machine?" → click **Use as Backup Disk**. If it doesn't ask: System Settings → General → Time Machine → Add Backup Disk → select the drive.
4. Tick **Encrypt Backup Disk** and set a password. Write that password down somewhere that is NOT only on this Mac (e.g. your phone's notes app or a paper note) — if the Mac dies, an unencrypted backup is fine, but you set encryption because thieves shouldn't get your freelance contracts if the drive is stolen.
5. Let the first backup run fully (can take hours, leave it plugged in and the Mac awake). After that it backs up automatically every hour whenever the drive is connected.

**Step 2 — Turn on iCloud for your Photos (instant off-site copy):**
1. Apple menu → System Settings → [your name] → iCloud → Photos → turn on "Sync this Mac".
2. System Settings → General → Storage → Storage Settings → Optimize Mac Storage: leave this **ON** for Photos is fine, but see Careful below re: the external drive.

**Step 3 — Give the freelance folder (contracts, invoices, designs) a second, separate off-site copy:**
Time Machine covers this too, but freelance files are the ones that cost you money or a client relationship if lost, so they get a second independent copy:
1. Put that folder inside iCloud Drive (drag it into the iCloud Drive folder in Finder) — this syncs it off your Mac automatically, same mechanism as Photos.
2. Or, if you don't want it in iCloud Drive, install Backblaze ($9/month per Mac, 2026 price, check) for unlimited cloud backup of everything including that folder — more expensive but zero folder management.
   Decision made for you: use iCloud Drive (free, already set up) rather than paying for Backblaze, since Time Machine already gives you the local backup. Switch to Backblaze if you want backups even when the external drive is never plugged in.

## Careful

- **iCloud is sync, not backup.** If you delete a photo or a contract on your Mac while iCloud is on, it deletes from iCloud (and any other device) too. Time Machine on the external drive is your actual "undo a mistake" safety net — keep it plugged in regularly.
- **"Optimize Mac Storage" for Photos** only removes full-resolution originals from your Mac's local disk (keeping them in iCloud) — it does NOT affect what Time Machine backs up correctly, but it means if iCloud itself is ever the only surviving copy and your Apple account is locked or disputed, you have thumbnails, not originals, on the Mac. Mitigation: Time Machine backs up whatever is on disk at backup time, so keep Time Machine running regardless.
- **A stolen or lost external drive without encryption** exposes every contract, invoice, and design to whoever finds it. You already turned encryption on in Step 1 — don't skip that checkbox.
- **If your Apple ID ever gets locked, hacked, or you forget the password**, both your iCloud Photos and iCloud Drive freelance folder become inaccessible until Apple restores access (can take days). The external Time Machine drive is unaffected by any of this — that's exactly why you have both.
- **Ransomware or malware on your Mac can encrypt/corrupt local files, and if Time Machine is always plugged in, it can corrupt the backup too.** Once your backup history looks healthy (after a week), unplug the drive when you're not actively using the Mac for backup, or budget for Backblaze which keeps 30 days of version history off-site regardless of what happens to your Mac.

## Check it worked

Pick any one photo and one file from the freelance folder. Unplug the Time Machine drive, then reconnect it, open Time Machine (menu bar icon → Enter Time Machine, or Finder → Time Machine in sidebar), go back to an earlier date, and restore just that one photo and file to a temporary folder on the Desktop. If both open correctly, your backup works. Do this once now and once every few months.

## Decided for you

- Chose **Time Machine + external SSD** over a cloud-only backup service as your primary backup, because it's free (you already own it via macOS), faster to restore from, and doesn't depend on your internet connection.
- Chose **encryption on the backup drive** over leaving it unencrypted, because the freelance folder contains client contracts and invoices — personal/business data that shouldn't be readable if the drive is lost or stolen.
- Chose **iCloud Drive** for the freelance folder's second copy over paying for Backblaze, because you already pay for iCloud (or can on the free/cheap tier) and don't need unlimited history for a folder that's probably a few GB — revisit this if that folder holds sensitive client data you don't want sitting in iCloud at all (see "Only you can decide" below).
- Chose **not to set up Backblaze by default**, because paying $9/month for full-Mac cloud backup is overkill unless you specifically want backups when the external drive is never connected (e.g. you travel a lot).

## Only you can decide

- **Where do you keep the external drive?** Assumed: near your desk, plugged in most of the time you're working, unplugged occasionally per the ransomware note above. If you travel with the laptop and rarely return to that drive, tell me and I'll set up Backblaze instead so you're actually covered while away.
- **Is any client's data under an NDA or contract that restricts where it can be stored (e.g. "must not leave the EU," "must not be stored in third-party cloud")?** Assumed: no such restriction, so iCloud Drive is fine for the freelance folder. If yes, that folder needs to stay Time-Machine-only (local drive), not in iCloud.
- **How much storage do you actually use?** Assumed your Photos + freelance folder fit comfortably under 1TB. If you have a large photo library (10,000+ photos/videos or lots of 4K video), get a 2TB drive instead of 1TB — check Apple menu → About This Mac → Storage before buying.
