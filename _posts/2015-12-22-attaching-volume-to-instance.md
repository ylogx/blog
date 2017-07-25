---
layout: post
title: Attaching Volume to an instance
subtitle: Step by step guide to attach, mount and reformat volume to an instance
date: '2015-12-22T00:00:00.000+05:30'
author: Shubham Chaudhary
comments: true
tags:
  - zomato
  - infra
  - aws
---

### Adding a partition/volume
A volume is like a hard disk attached to your system. First create a volume and attach it to your instance.

### Finding/Verifying attached volume

##### Option 1:

```bash
sudo lsblk
```
Output should look something like this:

```
 user@host $ sudo lsblk
NAME    MAJ:MIN RM    SIZE RO TYPE MOUNTPOINT
xvda    202:0    0     48G  0 disk
└─xvda1 202:2    0     48G  0 part /
xvdf    202:80   0     50G  0 disk /mnt/mongo_data
xvdg    202:96   0    500G  0 disk
```

If you see the output closely, you can see that `xvda` is a disk with `xvda1` partition mounted at root (/).

Similarly `xvdg` is a freshly added partition.

##### Option 2:

```bash
sudo fdisk -l
```

Output:

> Disk /dev/xvda: 48 GiB, 51539607552 bytes, 100663296 sectors
> Units: sectors of 1 * 512 = 512 bytes
> Sector size (logical/physical): 512 bytes / 512 bytes
> I/O size (minimum/optimal): 512 bytes / 512 bytes
> Disklabel type: gpt
> Disk identifier: A285F90B-B6D2-4DFB-BB36-CFCA7E815241
>
> Device     Start       End   Sectors    Size Type
> /dev/xvda1  34 100663262 100661214     48G Linux filesystem
>
> Disk /dev/xvdf: 50 GiB, 53687091200 bytes, 104857600 sectors
> Units: sectors of 1 * 512 = 512 bytes
> Sector size (logical/physical): 512 bytes / 512 bytes
> I/O size (minimum/optimal): 512 bytes / 512 bytes
> Disk _**/dev/xvdg**_: _500 GiB_, 536870912000 bytes, 1048576000 sectors
> Units: sectors of 1 * 512 = 512 bytes
> Sector size (logical/physical): 512 bytes / 512 bytes
> I/O size (minimum/optimal): 512 bytes / 512 bytes

You can also see here the device name for fresh 500GB partition is `/dev/xvdg` as shown in 4th line from bottom. Note down this device name, you'll need it in next steps.


### Formatting a freshly attached partition:
1. Find the identifier as mentioned above

```bash
sudo fdisk /dev/xvdg  # After this command you will be prompted, press following commands followed by enter key
```

> Welcome to fdisk (util-linux 2.25.2).
> Changes will remain in memory only, until you decide to write them.
> Be careful before using the write command.
>
> Device does not contain a recognized partition table.
> Created a new DOS disklabel with disk identifier 0x17fef037.
>
> Command (m for help):

```
    n  # add a new partition
```

> Partition type
>    p   primary (0 primary, 0 extended, 4 free)
>    e   extended (container for logical partitions)

```
    p
```

> Partition number (1-4, default 1):

```
    <enter>
```
> First sector (2048-1048575999, default 2048):
>
> Last sector, +sectors or +size{K,M,G,T,P} (2048-1048575999, default 1048575999):

```
    <enter>
```

> Created a new partition 1 of type 'Linux' and of size 500 GiB.
>
> Command (m for help):

```
    w  # write table to disk and exit
```

This will apply the changes to disk and exit.

#### Now we format the partition

```bash
sudo mkfs.ext4 /dev/xvdg1
```


## Mounting on every boot

#### Adding to fstab

```bash
sudo blkid
```

> /dev/xvda1: LABEL="cloudimg-rootfs" UUID="ae0adbc7-8703-4e7e-8d8d-eead38e0578f" TYPE="ext4"
> **_/dev/xvdg1_**: UUID="**b38e5f52-6aed-43ae-80dd-9eb8246a1511**" TYPE="ext4"

Edit the fstab file. Use the UUID mentioned above

```bash
vim /etc/fstab
```

> LABEL=cloudimg-rootfs	/	 ext4	defaults	0 0
> *UUID=b38e5f52-6aed-43ae-80dd-9eb8246a1511   /home/admin/path/new_disk ext4 defaults 0 0*

Read more about [fstab here](https://wiki.archlinux.org/index.php/Fstab)


## Mounting partition one-time

```bash
mkdir /home/admin/path/new_disk
sudo mount /dev/xvdg1 /home/admin/path/new_disk
```

See if you can access file in new partition:

```bash
ls -l /home/admin/path/new_disk
```

## Verifying final partition table

```bash
sudo lsblk
```

> NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
> xvda    253:0    0    50G  0 disk
> └─xvda1 253:1    0    50G  0 part /
> xvdg    253:16   0   500G  0 disk
> └─xvdg1 253:17   0   500G  0 part /home/admin/path/new_disk
