#!/usr/bin/env bash
set -eux

function create_new_post() {
    echo "---
layout: post
title: <TODO>
subtitle: <TODO>
date: '$(date +%FT%T.%N%:z)'
author: Shubham Chaudhary
header-img: img/<TODO>
permalink: <TODO>
comments: true
published: false
tags:
  - <TODO>
---" > "${full_file_path}"


    echo "Run: vim ${full_file_path}"
}
name="${1}"
new_file_name="$(date +%F)-${name}.md"
full_file_path="_posts/${new_file_name}"

if [[ -f "${full_file_path}" ]]; then
    echo "File already exists"
    printf "You can delete the file using:\nrm -f ${full_file_path}\n"
else
    create_new_post
fi
