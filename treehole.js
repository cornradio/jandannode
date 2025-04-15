#!/usr/bin/env node
//update https://gist.github.com/cornradio/55d9e5053260e7db8c9464e05edffcfa

const https = require('https');
const readline = require('readline');

const postId = process.argv[2] || '102312';

let currentPage = 1;
let comments = [];
let index = 0;
let currentTucao = null;

function fetchComments(postId, page = 1) {
  return new Promise((resolve, reject) => {
    const url = `https://jandan.net/api/comment/post/${postId}?order=desc&page=${page}`;
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.code === 0) {
            resolve(json.data.list);
          } else {
            reject(new Error('API 返回错误'));
          }
        } catch (e) {
          reject(new Error('JSON 解析失败'));
        }
      });
    }).on('error', reject);
  });
}

function fetchTucao(commentId) {
  return new Promise((resolve, reject) => {
    const url = `https://jandan.net/api/tucao/list/${commentId}`;
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.code === 0) {
            resolve(json.tucao);
          } else {
            reject(new Error('API 返回错误'));
          }
        } catch (e) {
          reject(new Error('JSON 解析失败'));
        }
      });
    }).on('error', reject);
  });
}

function removeHtmlTags(text) {
  return text.replace(/<[^>]*>/g, '');
}

function printComment(comment, index, page) {
  console.clear();
  console.log(`📄 第 ${page} 页 - 第 ${index + 1} 条`);
  console.log(`🔗 https://jandan.net/t/${comment.id}`);
  console.log(`👤 ${comment.author} 🌍 ${comment.ip_location} 💬 ${comment.sub_comment_count}`);
  console.log(`🕒 ${comment.date_gmt}`);
  console.log(`---`);
  console.log(`${comment.content}`);
  console.log(`---`);
  console.log(`👍 oo: ${comment.vote_positive} | 👎 xx: ${comment.vote_negative}`);
  
  if (currentTucao) {
    console.log('\n💬 吐槽：');
    currentTucao.forEach((tucao, i) => {
      console.log(`\n${i + 1}. ${tucao.comment_author} 🌍 ${tucao.ip_location}:`);
      console.log(`---`);
      console.log(`${removeHtmlTags(tucao.comment_content)}`);
      console.log(`---`);
      console.log(`oo: ${tucao.vote_positive} | xx: ${tucao.vote_negative}`);
    });
  }
  
  if (currentTucao) {
    console.log(`\n← 上一条 | → 下一条 | ↑ 退出吐槽 | ESC 退出`);
  } else {
    console.log(`\n← 上一条 | → 下一条 | ↓ 查看吐槽 | ESC 退出`);
  }
}

async function loadPage(pageNum) {
  console.clear();
  console.log('【正在获取，请稍候……】');
  const newComments = await fetchComments(postId, pageNum);
  if (!newComments.length) {
    console.log('🚫 没有更多评论了。');
    process.exit(0);
  }
  return newComments;
}

async function nextComment() {
  if (index >= comments.length - 1) {
    currentPage++;
    index = 0;
    comments = await loadPage(currentPage);
  } else {
    index++;
  }
  currentTucao = null;
  printComment(comments[index], index, currentPage);
}

async function prevComment() {
  if (index <= 0 && currentPage > 1) {
    currentPage--;
    comments = await loadPage(currentPage);
    index = comments.length - 1;
  } else if (index > 0) {
    index--;
  }
  currentTucao = null;
  printComment(comments[index], index, currentPage);
}

async function showTucao() {
  if (!currentTucao) {
    try {
      currentTucao = await fetchTucao(comments[index].id);
      printComment(comments[index], index, currentPage);
    } catch (err) {
      console.error('❌ 获取吐槽失败：', err.message);
    }
  }
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  readline.emitKeypressEvents(process.stdin, rl);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  try {
    comments = await loadPage(currentPage);
    printComment(comments[index], index, currentPage);

    process.stdin.on('keypress', async (str, key) => {
      if (key.name === 'right') {
        await nextComment();
      } else if (key.name === 'left') {
        await prevComment();
      } else if (key.name === 'down') {
        await showTucao();
      } else if (key.name === 'up' && currentTucao) {
        currentTucao = null;
        printComment(comments[index], index, currentPage);
      } else if (key.name === 'escape') {
        console.log('\n👋 已退出。');
        process.exit(0);
      }
    });
  } catch (err) {
    console.error('❌ 错误：', err.message);
    process.exit(1);
  }
}

main();