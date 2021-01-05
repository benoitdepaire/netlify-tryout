## How to set up a Vue website and Functions on Netlify

Ok, to start with, we assume you have created a Netlify account and a Github account. Now follow these steps:

### Vue website
- Create a new local Vue project with vue-cli: `vue create netlify-tryout`. We will select Vue2 default settings for setting up this vue project.
- Get into the project folder `cd netlify-tryout` and verify that everything is working with `npm run serve`. 
- Create an empty github repository (preferably with the same name to keep things simple, i.e. netlify-tryout).
- If working in VSCode, save as a new workspace. Update `.gitignore` to also exclude the workspace configuration file `netlify-tryout.code-workspace`.
- Add and commit the changes to your local git repository (`git add -A` and `git commit -m "..."`
- Connect the local git repo with the remote repo: `git remote add origin https://github.com/***/netlify-tryout.git`.
- We use git flow to manage releases: `git flow init`. Default values are OK. (not necessary)
- Make sure you are in the develop branch (`git branch -a`). If not, switch to this branch (`git checkout develop`) and create this branch on the remote: `git push --set-upstream origin develop`
- Switch to the master branch (`git checkout master`) and create this branch on the remote repo: `git push --set-upstream origin master``. __Switch back to the develop branch!__
- Make changes to the Vue website and check if your site still works: `npm run serve`
- Build your website for production: `npm run build`
- Remove the `dist` folder from `.gitignore`
- Add all changes and commit them to the `develop` branch.
- Prepare a release
  - `git flow release start '0.1.0'`
  - If necessary, change the version in `package.json` and commit locally.
  - `git flow release finish '0.1.0'`
- Update the remote branches:
  - `git checkout develop` && `git push`
  - `git checkout master` && `git push`
- Go back to the develop branch
- Go to Netlify and log in to your own account. Go to site and click on the button 'New site from Github'. Select your remote repo. It should automatically deploy your website

### Add Netlify functions
- Install Netflify Lambda package (locally): `npm i --save-dev netlify-lambda`
- Create a folder containing your functions: `mkdir functions`
- Create a new file inside this folder with the name `test.js` and write your first function:
```javascript
exports.handler = (event, context, callback) => {
  callback(null, {
      statusCode: 200,
      body: 'Yey!',
  });
};
```
- Open `package.json` and add some scripts:
```json
"scripts": {
    "start-functions": "netlify-lambda serve functions",
    "build-functions": "netlify-lambda build functions"
},
```
- Create a folder where Netlify can store the functions it has built. `mkdir .netlify/functions`
- Now create a `netlify.toml` file in the root folder and add the following lines:
```
[build]
command = "npm run build-functions"
functions = ".netlify/functions"
```
- Test your function locally: `npm run start-functions`
- Create a second release and push this release to github
- You can test the function at `http://***.netlify.app/.netlify/functions/test` 
