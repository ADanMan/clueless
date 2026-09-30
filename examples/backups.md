# "Set up backups for me, I know nothing"

> I have a MacBook with all my photos and a folder of my freelance work (contracts, invoices, designs). I know nothing about backups and don't want to learn. Just set it up for me nicely, tell me what to do step by step.

## Without clueless

Time Machine on an external drive, iCloud Photos + Desktop & Documents sync, buy the 200 GB plan, plug the drive in once a week. "That's genuinely it."

Not said: iCloud is sync, so a deleted file is deleted everywhere. "Optimize Mac Storage" leaves only thumbnails on the Mac, so Time Machine backs up thumbnails. The drive has client contracts on it and isn't encrypted. Nobody ever tested a restore.

## With clueless

```
Do this
  1. Time Machine on an external SSD. Say yes to "Encrypt Backup Disk".
  2. iCloud Photos + iCloud Drive. Optimize Mac Storage: OFF, so full-res
     originals live on the Mac and land in the backup.
  3. One off-site copy of the freelance folder (Google Drive is free at 15 GB).

Careful
  - iCloud is sync, not backup. Delete here, deleted everywhere. The drive
    is what saves you, because it keeps history.
  - A drive that lives next to the laptop dies with it. Unplug when you leave,
    or keep a second one elsewhere.

Check it worked
  Tomorrow, restore one random file from the freelance folder via
  Time Machine. If it comes back intact, the backup is real.

Decided for you
  - Time Machine + iCloud over Backblaze: free and built in. Backblaze wins
    if you travel and won't plug in a drive.
  - Encrypted over unencrypted: costs nothing, protects client contracts.

Only you can decide
  - Where the second drive lives (assumed: you don't have one yet).
  - Which cloud account for the off-site copy (assumed Google).
  - How full the Mac is (assumed under 1 TB; get 2 TB for RAW/4K).
```
