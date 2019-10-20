# Visuoso

Visuoso is a basic library that combines several exisiting tools for visual regression testing (puppeteer, jsdom-screenshot) but wraps them in an optional docker wrapper, where the actual generation of the screenshot can be delegated to a docker container to work around font rendering inconsistencies between OSes.

If docker fails for any reason, it will run normally without docker softly, though you may find on MacOS and other non linux systems inconsistencies unless run with docker
