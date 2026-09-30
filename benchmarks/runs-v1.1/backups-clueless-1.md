**Careful (read this first):**
- iCloud Photos is *sync*, not backup — delete a photo on your phone and it deletes everywhere, including the Mac. The external drive below is your real safety net.
- If your freelance folder ever gets hit by ransomware or you get locked out of your Apple ID, a drive that's *always* plugged in gets encrypted/locked too. That's why step 4 (a second, disconnected copy) isn't optional, even though it'll feel like overkill.
- "Optimize Mac Storage" (in iCloud Photos settings) must be OFF, or Time Machine backs up tiny placeholder thumbnails instead of your real photos.

**Do this:**

1. **Buy an external drive.** Get one at least double the size of your current "About This Mac → Storage" number (System Settings → General → Storage). For a laptop with photos + documents, a **2TB SSD, ~$100–130 (2026 street price, check)** is the easy call — SSDs are small, silent, and take laptop abuse better than spinning hard drives. Any brand (Samsung T7, SanDisk Extreme, Crucial X9) is fine.

2. **Turn on Time Machine** (backs up literally everything automatically, forever):
   - Plug the drive in.
   - System Settings → General → Time Machine → Add Backup Disk → select your new drive.
   - When macOS asks "Encrypt this backup?" → **choose Encrypt** and set a password you'll remember (write it in a password manager, not a sticky note — if you lose this password, the backup is unrecoverable).
   - Let it run once, connected, until it finishes the first full backup (can take a few hours for lots of photos — leave it plugged in overnight).
   - After that, just plug the drive in every few days (or leave it plugged in at your desk) and it backs up automatically in the background. Nothing to click, nothing to remember.

3. **Turn on iCloud Photos** (System Settings → [your name] → iCloud → Photos → on), and make sure **"Optimize Mac Storage" is switched OFF** in that same screen. This gives you instant access to photos from your phone too, and a second copy in Apple's cloud — but remember, per the Careful note above, this is convenience, not your backup.

4. **Set up one offsite/disconnected copy of just the freelance folder** (contracts, invoices, designs — the stuff you'd be in real trouble losing, e.g. mid-dispute with a client or an audit):
   - Easiest option: **iCloud Drive**. Move (or copy) the freelance folder into iCloud Drive (Finder → iCloud Drive). It syncs automatically and lives on Apple's servers, physically separate from your house.
   - You likely need **more iCloud storage** for this plus your photos — go to System Settings → [your name] → iCloud → and pick the **200GB plan, ~$3/month (2026 pricing, check)**. 50GB (the free-tier paid plan) will fill up fast with photos.

**Check it worked:**
- Right-click any one photo in Photos app → "Show in Finder" isn't the test — instead, after the first Time Machine backup finishes, open **Time Machine app → browse backups → find that same photo in the backup**. If it's there, the whole chain works.
- For the freelance folder: on your phone or a browser, log into icloud.com/iclouddrive and confirm you can see and open one contract/invoice file. If you can open it from a device that isn't your Mac, your offsite copy is real.

**Decided for you:**
- Chose **Time Machine + external SSD** over a paid cloud backup service (Backblaze, etc.) because it's free (you already paid for the drive), built into the Mac, and needs zero setup after the first run. Downside you're accepting: if your house burns down or the drive is stolen alongside the laptop, that copy is gone too — which is exactly why step 4 exists.
- Chose **encrypting** the Time Machine backup over leaving it unencrypted, because that drive will have your contracts and invoices on it, and an unencrypted drive is a full identity/client-data leak if it's ever lost or stolen.
- Chose **iCloud Drive** over Dropbox/Google Drive for the offsite copy of the freelance folder because you're already paying for iCloud for photos — one bill, one login, nothing new to learn.
- Chose a **2TB SSD** over a cheaper 1TB HDD because photo libraries grow fast and you don't want to be reshuffling files in a year; SSDs also survive being tossed in a bag far better.

**Only you can decide:**
- Your total storage need (assumed: current usage × 2 fits in 2TB — if you have over 800GB already, size up to 4TB instead).
- Budget for the $3/month iCloud plan going forward (assumed: yes, it's cheap enough to just keep paying — cancel anytime in Settings if not).
- Whether any client contract legally requires you to keep files a specific way (e.g., certain industries require encrypted storage or data retention rules) — assumed: no such requirement, since none was mentioned.
