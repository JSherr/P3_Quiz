const readline = require('readline'); // Cargamos el modulo.

const {log, biglog, errorlog, colorize} = require("./out");

const cmds = require("./cmds");
/**
El problema de cargar el modulo "cmds" de esta forma y no desestructurando
como en el caso del modulo "out", es sus metodos ya no son locales (estan
en un modulo a parte) y no se encuentran. Por tanto, hay que poner el prefijo 
"cmds.funcionDeseada" en todos y cada uno de los comandos que quiera implementar.
*/

// Mensaje inicial
biglog('CORE Quiz', 'green');

/** 
Lo configuramos con la llamada a "createInterface".
La entrada y salida son las entradas estadandar.
*/
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize("quiz > ", 'blue'),
    /**
     La funcion completer sirve para completar los comandos con el tabulador.
     Si hago doble click sin empezar a escribir nada me muestra todas las opciones.
    */
    completer: (line) => {
        const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
        const hits = completions.filter((c) => c.startsWith(line));
        // show all completions if none found
        return [hits.length ? hits : completions, line];
    }
});

rl.prompt();

// El metodo "prompt" nos muestra un prompt para indicarnos que esta esperando a que tecleemos algo. 

// "rl" es un emisor de eventos. Cuando se produzca el evento line vamos a ejecutar la funcion (el callback).

rl.on('line', (line) => {

    // Proceso la linea que tecleo y la troceo en lo que es el comando y los argumentos.
    let args = line.split(" ");
    let cmd = args[0].toLowerCase().trim(); // en minusculas (toLowerCase) y quito blancos (trim).

    // A las funciones que necesiten parametros (id) les paso el args[1].

    switch (cmd) {
        case '':
            rl.prompt();
            break;

        case 'help':
        case 'h':
            cmds.helpCmd(rl);
            break;

        case 'quit':
        case 'q':
            cmds.quitCmd(rl);
            break;

        case 'add':
            cmds.addCmd(rl);
            break;

        case 'list':
            cmds.listCmd(rl);
            break;

        case 'show':
            cmds.showCmd(rl, args[1]);
            break;

        case 'test':
            cmds.testCmd(rl, args[1]);
            break;

        case 'play':
        case 'p':
            cmds.playCmd(rl);
            break;

        case 'delete':
            cmds.deleteCmd(rl, args[1]);
            break;

        case 'edit':
            cmds.editCmd(rl, args[1]);
            break;

        case 'credits':
            cmds.creditsCmd(rl);
            break;

        default:
            log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
            log(`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
            rl.prompt();
            break;
    }
})
.on('close', () => {
    log('¡Hasta pronto!');
    process.exit(0);
});


