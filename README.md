# en4010_fa21_g11
CEN-4010 Fall 2021 Semester Project

# Getting started

NodeJS is needed in order to run frontend

note: yarn commands will not work unless yarn is installed use npm instead

1) from within the front-end folder run the command "npm install" or "yarn" this installs all the dependencys for the front end

2) you can now run either "npm run start" or "yarn start" from within the front-end folder and this will show you front end page.

3) Backend will not work unless the api has been doployed on lamp


# Deployment
  1) In front-end folder run "npm run build" or "yarn build" this will compile the front end

  2) The files in the Build folder are then copied to the respected folder in lamp

  3) c.php needs to be created in a folder before /public in lamp. DO NOT create c.php in the public folder. For one it will not work and two it has the database passwords and usernames in it. You will notice there is no c.php in this repo because of that

  4) Copy the remaining php files into the api folder in lamp