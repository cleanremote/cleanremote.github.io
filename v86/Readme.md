[![Join the chat at https://gitter.im/copy/v86](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/copy/v86)

Changes made to copy's v86:
- Added PWA support (tested in Chrome)
- Added PAE and NX bits to CPUID to make Windows 8/10 work (it still doesn't)

v86 emulates an x86-compatible CPU and hardware. Machine code is translated to
WebAssembly modules at runtime in order to achieve decent performance. Here's a
list of emulated hardware:

- An x86-compatible CPU. The instruction set is around Pentium III level,
 including full SSE2 support. Some features are missing, in particular:
  - Task gates, far calls in protected mode
  - Some 16 bit protected mode features
  - Single stepping (trap flag, debug registers)
  - Some exceptions, especially floating point and SSE
  - Multicore
  - PAE
  - 64-bit extensions
- A floating point unit (FPU). Calculations are done using the Berkeley
  SoftFloat library and therefore should be precise (but slow). Trigonometric
  and log functions are emulated using 64-bit floats and may be less precise.
  Not all FPU exceptions are supported.
- A floppy disk controller (8272A).
- An 8042 Keyboard Controller, PS2. With mouse support.
- An 8254 Programmable Interval Timer (PIT).
- An 8259 Programmable Interrupt Controller (PIC).
- Partial APIC support.
- A CMOS Real Time Clock (RTC).
- A generic VGA card with SVGA support and Bochs VBE Extensions.
- A PCI bus. This one is partly incomplete and not used by every device.
- An IDE disk controller.
- An NE2000 (8390) PCI network card.
- A virtio filesystem.
- A SoundBlaster 16 sound card.

Compatibility
-

Here's an overview of the operating systems supported in v86:

- Linux works pretty well. Neither 64-bit nor PAE kernels are supported.
  - Damn Small Linux (2.4 Kernel) works.
  - All tested versions of TinyCore work.
  - [BuildRoot](https://buildroot.uclibc.org) can be used to build a minimal
    image. [humphd/browser-vm](https://github.com/humphd/browser-vm) has some
    useful scripts for building one.
  - Archlinux works. See [archlinux.md](docs/archlinux.md) for building an image.
  - Debian works. An image can be built from a Dockerfile, see [tools/docker/debian/](tools/docker/debian/).
  - Alpine Linux works.
- ReactOS works.
- FreeDOS, Windows 1.01 and MS-DOS run very well.
- KolibriOS works.
- Haiku works.
- Android x86 1.6-r2 works if one selects VESA mode at the boot prompt. Newer
  versions haven't been tested.
- Windows 1, 3.0, 95, 98, ME, 2000, XP, Vista, and 7 work. Other versions may not work (see [#86](https://github.com/copy/v86/issues/86), [#208](https://github.com/copy/v86/issues/208)) or haven't been tested.
  - In Windows 2000 and XP, the PC type may have to be changed from ACPI PC to Standard PC.
  - In Windows Vista and later, make sure to enable ACPI.
  - Windows 8 and later currently doesn't boot due to unknown reasons (see [#393](https://github.com/copy/v86/issues/393)).
- Many hobby operating systems work.
- 9front works.
- Plan 9 doesn't work.
- QNX works.
- OS/2 doesn't work.
- FreeBSD works.
- OpenBSD works with a specific boot configuration. At the `boot>` prompt type
  `boot -c`, then at the `UKC>` prompt `disable mpbios` and `exit`.
- NetBSD works only with a custom kernel, see [#350](https://github.com/copy/v86/issues/350).
- SerenityOS doesn't work due to missing PAE support.

How to build, run and embed?
-

You need:

- java (for Closure Compiler, not necessary when using `debug.html`)
- make
- gcc and libc-i386 for building some of the test binaries
- nasm, gdb and qemu-system (for running tests)
- rust-nightly with the wasm32-unknown-unknown target
- A version of clang compatible with rust-nightly
- nodejs (a recent version is required, 10.11.0 is known to be working)

See `tools/docker/test-image/Dockerfile` for a full setup on Debian.


- Run `make` to build the debug build (at `debug.html`).
- Run `make all` to build the optimized build (at `index.html`).
- ROM and disk images are loaded via XHR, so if you want to try out `index.html`
  locally, make sure to serve it from a local webserver. You can use `make run`
  to serve the files using Python's http module.
- If you only want to embed v86 in a webpage you can use libv86.js. For
  usage, check out the [examples](examples/).


Testing
-

The disk images for testing are not included in this repository. You can
download them directly from the website using:

`wget -P images/ https://k.copy.sh/{linux.iso,linux4.iso,buildroot-bzimage.bin,openbsd-floppy.img,kolibri.img,windows101.img,os8.img,freedos722.img}`

Run all tests: `make jshint rustfmt kvm-unit-test nasmtests nasmtests-force-jit expect-tests jitpagingtests qemutests rust-test tests`

See [tests/Readme.md](tests/Readme.md) for more infos.


API examples
-

- [Basic](examples/basic.html)
- [Programatically using the serial terminal](examples/serial.html)
- [A Lua interpreter](examples/lua.html)
- [Two instances in one window](examples/two_instances.html)
- [Saving and restoring emulator state](examples/save_restore.html)

Using v86 for your own purposes is as easy as:

```javascript
var emulator = new V86Starter({
    screen_container: document.getElementById("screen_container"),
    bios: {
        url: "../../bios/seabios.bin",
    },
    vga_bios: {
        url: "../../bios/vgabios.bin",
    },
    cdrom: {
        url: "../../images/linux.iso",
    },
    autostart: true,
});
```

See [starter.js](src/browser/starter.js).


License
-

v86 is distributed under the terms of the Simplified BSD License, see
[LICENSE](LICENSE). The following third-party dependencies are included in the
repository under their own licenses:

- [`lib/softfloat/softfloat.c`](lib/softfloat/softfloat.c)
- [`lib/zstd/zstddeclib.c`](lib/zstd/zstddeclib.c)
- [`tests/kvm-unit-tests/`](tests/kvm-unit-tests)
- [`tests/qemutests/`](tests/qemutests)


Credits
-

- CPU test cases via [QEMU](https://wiki.qemu.org/Main_Page)
- More tests via [kvm-unit-tests](https://www.linux-kvm.org/page/KVM-unit-tests)
- [zstd](https://github.com/facebook/zstd) support is included for better compression of state images
- [Berkeley SoftFloat](http://www.jhauser.us/arithmetic/SoftFloat.html) is included to precisely emulate 80-bit floating point numbers
- [The jor1k project](https://github.com/s-macke/jor1k) for 9p, filesystem and uart drivers
- [WinWorld](https://winworldpc.com/) sources of some old operating systems


More questions?
-

Shoot me an email to `copy@copy.sh`. Please report bugs on GitHub.


Author
-

Fabian Hemmer (https://copy.sh/, `copy@copy.sh`)
