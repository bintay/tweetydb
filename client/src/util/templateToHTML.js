export default function templateToHTML (template) {
   return template.replace(/___/g, `<span contenteditable="true" class="input"></span>`);
}
