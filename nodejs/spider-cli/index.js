#!/usr/bin/env node

// import inquirer from 'inquirer'
const inquirer = require('inquirer')
const commander = require('commander')

// https://juejin.cn/post/7178666619135066170
const { runImage } = require('./image')

const question = [
  {
    type: 'checkbox',
    name: 'channels',
    message: '请选择搜索方式',
    choices: [
      {
        name: '百度图片',
        value: 'baidu'
      }
    ]
  }, {
    type: 'input',
    name: 'keyword',
    message: '请输入搜索关键词'
  }
]

inquirer.prompt(question).then(result => {
  const { channels, keyword } = result
  for (let channel of channels) {
    switch (channel) {
      case 'baidu':
        runImage(keyword)
        break
    }
  }
})
