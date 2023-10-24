const inquirer = require('inquirer');
const fs = require('fs');

process.stdin.on('keypress', (_, key) => {
    if (key.name === "enter") {
        prompt.ui.close();
    }
});

const data = fs.readFileSync('db.txt', 'utf8');
var users = JSON.parse(data)

fillUsers()

async function fillUsers() {
    let toggle = true

    while (toggle) {
        let name_promise = inquirer
            .prompt([
                {
                    name: 'userName',
                    message: 'Enter username(Enter to exit):'
                }])

        await name_promise.then(async name => {
            if (name.userName !== '') {
                let gender_age_promise = inquirer.prompt([
                    {
                        type: 'list',
                        name: 'gender',
                        message: 'Choose your gender:',
                        choices: ['male', 'female'],
                    },
                    {
                        name: 'age',
                        message: 'Enter your age:'
                    },
                ])

                await gender_age_promise.then(gender_age => {
                    users.push({
                        userName: name.userName,
                        gender: gender_age.gender,
                        age: gender_age.age
                    })
                });
            }
            else toggle = false
        });
    }

    let search_user_promise =
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'searchUser',
                message: 'Would you to search user in DB?:'
            }
        ])

    let confirm
    await search_user_promise.then(confirmValue => {
        confirm = confirmValue
    });

    if(confirm){
        console.log(users)

        let search_user_promise =
        inquirer
            .prompt([
                {
                    name: 'userName',
                    message: 'Enter user to search:'
                }])

        await search_user_promise.then(name => {
                let user = users.find(user => user.userName.toUpperCase() === name.userName.toUpperCase())

                if(user === undefined){
                    console.log("This user is not exist.")
                }
                else{
                    console.log(user)
                }
        })
    }
    else console.log("Goodbye!")

    fs.writeFile('db.txt', JSON.stringify(users), err => {
        if (err) {
            console.error(err);
        }
    });
}