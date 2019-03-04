

const {log, biglog, errorlog, colorize} = require("./out");

const model = require('./model'); // Se pone "./" porque es un fichero local.


/**
 NOTA: Algunas de estas funciones son asincronas. La llamada al prompt se hace
internamente en cada una de las llamadas a las funciones. Si estas son asincronas
la llamada se realizara dentro de las "callbacks" y si no como ultima sentencia. 
*/

/**
 * Muestra la ayuda.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.helpCmd = rl => {
    log("Comandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz indicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};

/**
NOTA: El objeto readline (rl) esta definido en el modulo "main" y, como podemos
observar, todos los comandos al final sacan los comandos utilizando dicho objeto.
Por tanto, hay que añadir a todos los comandos un primer argumento "rl" para que
pasar el objeto desde "main". En "main" tambien podemos observar que al hacer una 
llamada a estas funciones (comandos) se pasa como primer argumento el "rl".
*/

/**
 * Lista todos los quizzes existentes en el modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
        log(` [${colorize(id, 'magenta')}]:  ${quiz.question}`);
    });
    rl.prompt();
};


/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a mostrar.
 */
exports.showCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.addCmd = rl => {

    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};


/**
 * Borra un quiz del modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a borrar en el modelo.
 */
exports.deleteCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


/**
 * Edita un quiz del modelo.
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};

/**
NOTA: En la funcion anterior (edit), hemos usado el metodo "rl.write", que nos
permite simular que escribimos por el teclado. Esto se usa para que no haya que
escribir la pregunta entera cada vez que queremos editar un quiz.
El "setTimeout" con valor 0 se usa para que no tengamos que esperar nada al llamar
al metodo anterior.
*/

/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */
exports.testCmd = (rl, id) => {
    if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            rl.question(colorize(`${quiz.question}?`, 'red'), answer =>{
                const respuesta = answer.trim();
                const respuestaQuiz = quiz.answer;
                if ( respuestaQuiz.toUpperCase() === respuesta.toUpperCase()){
                    log('CORRECTO');
                    biglog('CORRECTO', 'green');
                    rl.prompt();
                }else{
                    log('INCORRECTO');
                    biglog('INCORRECTO', 'red');
                    rl.prompt();
                }
            });
            

        }catch(error){
            errorlog(error.message);
            rl.prompt();
        }
    }
};


/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.playCmd = rl => {
    let score = 0;
    let toBeResolved = [];
    toBeResolved = model.getAll();

    const rand = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const playOne = () =>{
        if (toBeResolved.length === 0){
            log(`${colorize('No hay más preguntas', 'green')}`);
            log(`Fin del juego. Has acertado un total de ${score} preguntas.`);
            biglog(`${score}`, 'magenta');
            rl.prompt();
        }else{
            
            let id = Math.floor(rand(0, toBeResolved.length));
            
            let quiz = toBeResolved[id];
            
            
            // Se realiza la pregunta para el id especificado.
            rl.question(`${colorize(quiz.question, 'green')} `, answer =>{
                let respuesta = answer.trim();
                let respuestaQuiz = quiz.answer;
                if ( respuestaQuiz.toUpperCase() === respuesta.toUpperCase()){
                    log('CORRECTO');
                    score++;
                    log(`Llevas ${score} aciertos.`)
                    biglog(`${score}`, 'magenta');
                    toBeResolved.splice(id, 1);
                    playOne();
                }else{
                    log('INCORRECTO.');
                    log(`Fin del juego. Has acertado un total de ${score} preguntas.`);
                    biglog(`${score}`, 'magenta');
                    rl.prompt();
                }
            
            });


        }
    };

    playOne();
    
};


/**
 * Muestra los nombres de los autores de la práctica.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.creditsCmd = rl => {
    log('Autores de la práctica:');
    log('Jesus Sousa Herranz', 'green');
    log('Agustin Rivero Ibañez', 'green');
    rl.prompt();
};


/**
 * Terminar el programa.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};

