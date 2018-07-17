export function loggerInit() {
    const loggerTemplate = document.getElementById('logger-template');
    let currentSlideElt;
    let currentLoggerElt;

    function clearLoggerElt(loggerElt) {
        loggerElt.innerHTML = '';
    }

    function createLoggerItemElement() {
        const element = loggerTemplate.content.cloneNode(true);
        return element.querySelector('.logger-item');
    }

    function log (v) {
        const newLoggerItemElt = createLoggerItemElement();
        newLoggerItemElt.textContent = v;

        currentLoggerElt.appendChild(newLoggerItemElt);
    }

    // todo несколько нажатий на кнопку
    function loggerRun (runFunction) {
        currentSlideElt = document.querySelector('.slide.active');
        currentLoggerElt = currentSlideElt.querySelector('.logger-playground');

        if (currentLoggerElt) {
            clearLoggerElt(currentLoggerElt);
            runFunction.call(null);
        }
    }

    // todo погасить
    function loggerSubscribe (stream$) {
        stream$.subscribe(value => log(value));
    }

    window.logger = {
        run: loggerRun,
        subscribe: loggerSubscribe,
        log
    }
}
