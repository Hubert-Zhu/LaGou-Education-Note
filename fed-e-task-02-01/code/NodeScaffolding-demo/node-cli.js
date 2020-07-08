#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer'); // 命令行交互插件

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Project name?',
        default: 'my-project'
    },
    {
        type: 'input',
        name: 'desc',
        message: 'author?',
        default: 'N/A'
    }
])
.then(answers => {
    fs.mkdirSync(path.join(__dirname, 'templates'));
    fs.appendFile(path.join(__dirname, 'templates/index.html'), '初始化html', (err) => {
        if (err) {
            throw err
        }
    });
    fs.appendFile(path.join(__dirname, 'templates/style.css'), '初始化css', (err) => {
        if (err) {
            throw err
        }
    });
    fs.appendFile(path.join(__dirname, 'templates/index.js'), '初始化js', (err) => {
        if (err) {
            throw err
        }
    });
            
});