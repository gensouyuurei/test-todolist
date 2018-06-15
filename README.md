# A simple to-do list app
Written as a test task.
App is written using MEAN solution-stack with pug as a view engine. Used middleware you can see in a package.json file.  
App provides basic functionality:
* authentification with password encryption,
* user roles: admin and user,
* users can see only their tasks,
* users can add tasks to their list, tasks consist of text, priority (1-5) and completion status,
* users can sort tasks by priority or by status,
* admins, in addition, can see the tasks of all users. 

Setting up an admin is available only to a developer. To set up an admin, you must change 'createAdmin' config in .env file to 'true', which is 'true' by default, so be careful. Then there will be checkbox at registration page.

