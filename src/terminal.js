import {Terminal} from 'xterm'
import 'xterm/css/xterm.css'
import './terminal.css'
import copy from 'copy-to-clipboard'

// vscode-snazzy https://github.com/Tyriar/vscode-snazzy
var BaseTheme = {
  foreground: '#eff0eb',
  background: '#282a36',
  selection: '#97979b33',
  black: '#282a36',
  brightBlack: '#686868',
  red: '#ff5c57',
  brightRed: '#ff5c57',
  green: '#5af78e',
  brightGreen: '#5af78e',
  yellow: '#f3f99d',
  brightYellow: '#f3f99d',
  blue: '#57c7ff',
  brightBlue: '#57c7ff',
  magenta: '#ff6ac1',
  brightMagenta: '#ff6ac1',
  cyan: '#9aedfe',
  brightCyan: '#9aedfe',
  white: '#f1f1f0',
  brightWhite: '#eff0eb'
};

var term = new Terminal({
  fontFamily: '"Cascadia Code", Menlo, monospace',
  theme: BaseTheme,
  cursorBlink: true,
});
term.open(document.querySelector('#terminal'));
var sizes = {
  width: Math.floor(window.innerWidth*0.06*2),
  height: Math.floor(window.innerHeight*0.0271*2),
}

if(window.innerWidth <= 768)
{
  sizes.width = Math.floor(window.innerWidth*0.086*2/window.devicePixelRatio);
  sizes.height = Math.floor((window.innerHeight*0.04*2)/window.devicePixelRatio);
  term.resize(sizes.width,sizes.height)
}else
{
  sizes.width = Math.floor(window.innerWidth*0.06*2)
  sizes.height = Math.floor(window.innerHeight*0.0271*2)
  window.addEventListener('resize', ()=>{
    sizes.width = Math.floor(window.innerWidth*0.06*2)
    sizes.height = Math.floor(window.innerHeight*0.0271*2)
    term.resize(sizes.width, sizes.height)
  })
  term.resize(sizes.width,sizes.height)
}
document.getElementsByClassName('xterm').onload = term.focus()

var commandslist =[];

function runTerminal() {
  if (term._initialized) {
    return;
  }

  term._initialized = true;

  term.prompt = () => {
    term.write('\r\n$ ');
  };
  term.writeln('try running `help`.');
  prompt(term);
  term.onData(e => {
    switch (e) {
      case '\u0003': // Ctrl+C
        term.write('^C');
        prompt(term);
        break;
      case '\r': // Enter
        commandslist.push(command);
        runCommand(term, command);
        command = '';
        commandno = 1;
        break;
      case '\u007F': // Backspace (DEL)
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write('\b \b');
          if (command.length > 0) {
            command = command.substr(0, command.length - 1);
          }
        }
        break;
      case '\u000A':
        runCommand(term,command);
        command = ''
        break;
      default: // Print all other characters for demo
        if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7B) || e >= '\u00a0') {
          command += e;
          term.write(e);
        }
    }
  });
}

function prompt(term) {
  command = '';
  term.write('\r\n$ ');
}

var command = '';
var url = {};
url.github = 'https://github.com/rohitkumarankam'
url.linkedin = 'https://www.linkedin.com/in/rohitkumarankam/'
url.twitter = 'https://twitter.com/rohitkumarankam'
url.resume = 'https://rka.li/resume'
url.email = 'rohit@rka.li'
url.website = 'https://rohitkumarankam.com/'
var commands = {
  help: {
    f: () => {
      term.writeln([
        'Welcome to commandline! Try some of the commands below.',
        '',
        ...Object.keys(commands).map(e => `  ${e.padEnd(10)} ${commands[e].description}`)
      ].join('\n\r'));
      prompt(term);
    },
    description: 'Prints this help message',
  },
  clear: {
    f: ()=>{
      term.clear();
      term.writeln("try running `help`.");
      prompt(term);
    },
    description: "clear's the terminal.",
  },
  whoami: {
    f: () => {
      term.writeln('Rohit Kumar Ankam'),
      prompt(term);
    },
    description: "Prints user's Name",
  },
  github:{
    f: () => {
      term.writeln('Opening Github: '+url.github);
      window.open(url.github, '_blank').focus();
      prompt(term);
    },
    description: "Opens user's Git Repo",
  },
  linkedin:{
    f: () => {
      term.writeln('Opening Linkedin: '+url.linkedin);
      window.open(url.linkedin, '_blank').focus();
      prompt(term);
    },
    description: "Opens user's Linkedin",
  },
  twitter:{
    f: () => {
      term.writeln('Opening Twitter: '+url.twitter);
      window.open(url.twitter, '_blank').focus();
      prompt(term);
    },
    description: "Opens user's Twitter",
  },
  email:{
    f: () => {
      term.writeln('email is: '+ url.email);
      term.writeln('email is copied to clipboard.');
      copy(url.email);
      prompt(term);
    },
    description: 'prints email of the user.',
  },
  website:{
    f: () => {
      term.writeln('Opening Website: ' + url.website);
      window.open(url.website, '_blank').focus();
      prompt(term);
    },
    description: 'opens website of the user.',
  },
  exit:{
    f:()=>{
      window.close();
    },
    description: "close terminal."
  },
};

function runCommand(term, text) {
  const command = text.trim().split(' ')[0];
  if (command.length > 0) {
    term.writeln('');
    if (command in commands) {
      commands[command].f();
      return;
    }
    term.writeln(`${command}: command not found`);
  }
  prompt(term);
}

runTerminal();
var commandno = 1;
window.addEventListener('keyup', (key)=>{
  if(key.code == 'ArrowUp')
  {
    if (commandslist.length>0){
      lineDistroy(term);
      term.write("$ "+commandslist[commandslist.length-commandno]);
      command = commandslist[commandslist.length-commandno];
    }

    if(commandno < commandslist.length){
      commandno++;
    }
  }
  if(key.code == 'ArrowDown')
  {
    if (commandslist.length>0){

      if (commandno > 1){
        lineDistroy(term);
        term.write("$ "+commandslist[commandslist.length-commandno+1]);
        command = commandslist[commandslist.length-commandno+1];
        if(commandno >1){
          commandno--;
        }
      }else{
        lineDistroy(term);
        term.write("$ ")
        command = '';
      }
    }
  }
})

function lineDistroy(term){
  for (var i = 0; i < 100; i++) {
    term.write('\b \b')
  }
}