---
layout: post
title: "install input method on arch"
description: "using fcitx5 to fit my wayland based Hyprland&sway environment"
date: 2024-01-21 21:03:36 +0530
categories: ArchLinux
---

using fcitx5 to fit my wayland based Hyprland&sway environment

```bash
yay -S fcitx5-gtk fcitx5-qt fcitx5-im fcitx5-lua fcitx5-chinese-addons fcitx5-pinyin-zhwiki fcitx5-configtool
```

then

- run `fcitx5-configtool` to config,
  - search `Pinyin` in `Search input method`(remember turn off "only show current language" below which is default on)
  - add Pinyin to left side(current input method)
  - in "Addons-Module", set cloud Pinyin configure, change its backend to baidu?
  - in "Addons-Input Method",set Pinyin configure, at least turn "cloud pinyin" on
- ctrl+space to switch input method
- in "Global Options" i turned "temporally switch" off(so only ctrl+space can switch input method)

in .zshrc:

```bash
#sometimes fcitx5 will notice GTK_IM_MODULE should not set
#export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```
