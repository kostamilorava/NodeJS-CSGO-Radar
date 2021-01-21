# <div align="center">Node.JS CSGO Radar</div>

---

## · Info

This project is updated, modified version of widely available projects that all are outdated.

It's proof of concept that Node.JS can be used as tool for managing such tasks.

Note that this project was only tested and was working on officially downloaded game from Steam.

## · Thanks to

- frk1's [hazedumper](https://github.com/frk1/hazedumper/) for providing and keeping up-to date offsets
- [unknowncheats](www.unknowncheats.me) for insane knowledge of it's members
- Rob--'s [memoryjs](https://www.npmjs.com/package/memoryjs) for creating tool that puts nodejs into another level

## · Before starting

Please download latest offsets from: https://github.com/frk1/hazedumper/ and put it in offsets.json

You can also manually find offset and put it there with hazedumper's structure.

Before downloading and running, make sure you are using X86 version of node. It's important as csgo.exe is currently
X86.

Please keep in mind that this is currently undetected by VAC. It can be deleted after certain time, so I am not
responsible for your bans.

## · Current State & Todo

Currently, script only writes memory in m_bSpotted so on radar enemies are forced to be shown.

Also, I store enemy health, armor, position and X-Y rotation in variables. I plan to split reader and server, so reader
will just send information to server. Server will then show full game information.

