# Front End Dev test

- When finished, zip up the test and send it back
- Using the supplied design (inside 'designs' folder), build the new component 'TopNav' on the provided page 'top-nav-example.html'. Show different instances (on the same page) for theme 1 and theme 2. Add descriptions above each instance so the functionality of each is clear.
- Use existing CSS preprocessors JS libraries, but feel free to add to them where you see fit.
- Feel free to use the internet as a resource.
- No specific CSS methodology is required, but you're encouraged to use practices inline with popular methodologies, such as SMACSS, SUIT-CSS and BEM.
- No specific JS framework is required, just vanilla JS (no jQuery). If you prefer to use Babel or Typescript, feel free to add them to the project.
- Handlebars has been setup for you to use, but if you prefer another templating language, feel free to add it to the project.
- Add JS to the page by combining all the relevant JS files into 1 file as part of the gulp build (marked by a 'TODO' in the gulpfile.js).
- Add a unit testing framework of your choice to the project and write tests for any 4 of the functions within 'Utils.js'.
- Style up the component to match the designs for both mobile and desktop.
- Look through TopNav.js and complete any area with comments marked 'TODO'.
- Use Google Font 'Open Sans' provided in the 'assets' folder for all text. 
- Fix JS Hint issues.


## Gulp commands

### Local dev server
Run `gulp webserver` and navigate to 'dist/TopNavExample.html' in a new window. Includes live reload.

### Watch
To watch scss, js and handlebars files, run `gulp watch` in a new window.